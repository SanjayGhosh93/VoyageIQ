// aisStream.js
// VoyageIQ / OceanCharter
// Route-based live AIS vessel feed using AISStream

const WebSocket = require('ws');

const AISSTREAM_URL = 'wss://stream.aisstream.io/v0/stream';

const API_KEY = process.env.AISSTREAM_API_KEY;

// ============================================================
// CONFIGURATION
// ============================================================

const DEFAULT_CORRIDOR_KM = 100;

// Remove vessels that haven't sent a position update
// for this amount of time.
const VESSEL_TIMEOUT_MS = 10 * 60 * 1000;

// Reconnect delay
const RECONNECT_DELAY_MS = 5000;

// Maximum vessels returned to frontend
const MAX_VESSELS = 2000;

// Stream diagnostics
let messagesReceived = 0;
let positionMessagesReceived = 0;
let staticMessagesReceived = 0;
let routeVesselsAccepted = 0;
let lastMessageType = null;
let firstMessageLogged = false;

// Maximum route segments used to build AIS bounding boxes
const MAX_ROUTE_SEGMENTS = 100;

// ============================================================
// MEMORY
// ============================================================

const vessels = new Map();

let socket = null;
let reconnectTimer = null;

let connected = false;
let started = false;

let lastMessageAt = null;

// Current route
let currentRoute = [];

// Current corridor
let currentCorridorKm = DEFAULT_CORRIDOR_KM;

// Current AIS bounding boxes
let currentBoundingBoxes = [];

// ============================================================
// SHIP TYPE COLORS
// ============================================================

const SHIP_TYPES = {
  cargo: {
    type: 'cargo',
    typeLabel: 'Cargo',
    color: '#22D3EE',
  },

  tanker: {
    type: 'tanker',
    typeLabel: 'Tanker',
    color: '#F59E0B',
  },

  passenger: {
    type: 'passenger',
    typeLabel: 'Passenger',
    color: '#A78BFA',
  },

  fishing: {
    type: 'fishing',
    typeLabel: 'Fishing',
    color: '#34D399',
  },

  towing: {
    type: 'towing',
    typeLabel: 'Towing',
    color: '#FB923C',
  },

  dredging: {
    type: 'dredging',
    typeLabel: 'Dredging',
    color: '#A16207',
  },

  diving: {
    type: 'diving',
    typeLabel: 'Diving Operations',
    color: '#14B8A6',
  },

  military: {
    type: 'military',
    typeLabel: 'Military',
    color: '#EF4444',
  },

  sailing: {
    type: 'sailing',
    typeLabel: 'Sailing',
    color: '#3B82F6',
  },

  pleasure: {
    type: 'pleasure',
    typeLabel: 'Pleasure Craft',
    color: '#8B5CF6',
  },

  highSpeed: {
    type: 'high_speed',
    typeLabel: 'High-Speed Craft',
    color: '#EC4899',
  },

  pilot: {
    type: 'pilot',
    typeLabel: 'Pilot',
    color: '#EAB308',
  },

  searchRescue: {
    type: 'search_rescue',
    typeLabel: 'Search and Rescue',
    color: '#F43F5E',
  },

  tug: {
    type: 'tug',
    typeLabel: 'Tug',
    color: '#F97316',
  },

  portService: {
    type: 'port_service',
    typeLabel: 'Port / Service',
    color: '#06B6D4',
  },

  special: {
    type: 'special',
    typeLabel: 'Special',
    color: '#F472B6',
  },

  wingInGround: {
    type: 'wing_in_ground',
    typeLabel: 'Wing-in-Ground',
    color: '#6366F1',
  },

  other: {
    type: 'other',
    typeLabel: 'Other / Unknown',
    color: '#94A3B8',
  },
};

// ============================================================
// HELPERS
// ============================================================

function cleanText(value) {
  if (
    value === undefined ||
    value === null
  ) {
    return '';
  }

  return String(value).trim();
}

function clamp(value, min, max) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}

// ============================================================
// AIS SHIP TYPE CLASSIFICATION
// ============================================================

function normalizeShipType(shipType) {
  const type = Number(shipType);

  if (!Number.isFinite(type)) {
    return SHIP_TYPES.other;
  }

  // 20-29
  if (type >= 20 && type <= 29) {
    return SHIP_TYPES.wingInGround;
  }

  // 30 - Fishing
  if (type === 30) {
    return SHIP_TYPES.fishing;
  }

  // 31-32 - Towing
  if (type === 31 || type === 32) {
    return SHIP_TYPES.towing;
  }

  // 33 - Dredging / underwater operations
  if (type === 33) {
    return SHIP_TYPES.dredging;
  }

  // 34 - Diving operations
  if (type === 34) {
    return SHIP_TYPES.diving;
  }

  // 35 - Military
  if (type === 35) {
    return SHIP_TYPES.military;
  }

  // 36 - Sailing
  if (type === 36) {
    return SHIP_TYPES.sailing;
  }

  // 37 - Pleasure craft
  if (type === 37) {
    return SHIP_TYPES.pleasure;
  }

  // 40-49 - High speed craft
  if (type >= 40 && type <= 49) {
    return SHIP_TYPES.highSpeed;
  }

  // 50 - Pilot vessel
  if (type === 50) {
    return SHIP_TYPES.pilot;
  }

  // 51 - Search and Rescue
  if (type === 51) {
    return SHIP_TYPES.searchRescue;
  }

  // 52 - Tug
  if (type === 52) {
    return SHIP_TYPES.tug;
  }

  // 53 - Port tender / service
  if (type === 53) {
    return SHIP_TYPES.portService;
  }

  // 54 - Anti-pollution
  if (type === 54) {
    return SHIP_TYPES.portService;
  }

  // 55 - Law enforcement
  if (type === 55) {
    return SHIP_TYPES.special;
  }

  // 56-59 - Local / special service
  if (type >= 56 && type <= 59) {
    return SHIP_TYPES.portService;
  }

  // 60-69 - Passenger
  if (type >= 60 && type <= 69) {
    return SHIP_TYPES.passenger;
  }

  // 70-79 - Cargo
  if (type >= 70 && type <= 79) {
    return SHIP_TYPES.cargo;
  }

  // 80-89 - Tanker
  if (type >= 80 && type <= 89) {
    return SHIP_TYPES.tanker;
  }

  // 90-99 - Other
  if (type >= 90 && type <= 99) {
    return SHIP_TYPES.other;
  }

  return SHIP_TYPES.other;
}

// ============================================================
// MMSI
// ============================================================

function getMMSI(message, data = null) {
  const values = [
    message?.MetaData?.MMSI,
    data?.UserID,
    data?.MMSI,
    data?.Mmsi,
  ];

  for (const value of values) {
    const number = Number(value);

    if (
      Number.isFinite(number) &&
      number > 0
    ) {
      return number;
    }
  }

  return null;
}

// ============================================================
// DISTANCE
// ============================================================

function haversineDistanceKm(
  lat1,
  lng1,
  lat2,
  lng2
) {
  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLng =
    ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(
      (lat1 * Math.PI) / 180
    ) *
      Math.cos(
        (lat2 * Math.PI) / 180
      ) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return (
    2 *
    R *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}

// ============================================================
// POINT TO ROUTE DISTANCE
// ============================================================

function normalizeLongitudeDeltaDegrees(delta) {
  let d = delta;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
}

function distancePointToSegmentKm(lat, lng, a, b) {
  // Work in a local equirectangular projection.  This is accurate enough
  // for the relatively small route corridor segments and, importantly,
  // handles segments crossing the International Date Line.
  const lat0 = ((lat + a.lat + b.lat) / 3) * Math.PI / 180;
  const cosLat0 = Math.max(0.15, Math.cos(lat0));
  const kmPerDegLat = 111.32;
  const kmPerDegLng = 111.32 * cosLat0;

  const ax = normalizeLongitudeDeltaDegrees(a.lng - lng) * kmPerDegLng;
  const ay = (a.lat - lat) * kmPerDegLat;
  const bx = normalizeLongitudeDeltaDegrees(b.lng - lng) * kmPerDegLng;
  const by = (b.lat - lat) * kmPerDegLat;

  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return Math.sqrt(ax * ax + ay * ay);
  }

  const t = Math.max(
    0,
    Math.min(1, -(ax * dx + ay * dy) / lengthSquared)
  );

  const px = ax + t * dx;
  const py = ay + t * dy;

  return Math.sqrt(px * px + py * py);
}

function distanceToRouteKm(lat, lng, route) {
  if (!Array.isArray(route) || route.length === 0) {
    return Infinity;
  }

  if (route.length === 1) {
    return haversineDistanceKm(lat, lng, route[0].lat, route[0].lng);
  }

  let minimum = Infinity;

  for (let i = 0; i < route.length - 1; i += 1) {
    const distance = distancePointToSegmentKm(
      lat,
      lng,
      route[i],
      route[i + 1]
    );

    if (distance < minimum) {
      minimum = distance;
    }
  }

  return minimum;
}

// ============================================================
// ROUTE VALIDATION
// ============================================================

function normalizeRoute(route) {
  if (!Array.isArray(route)) {
    return [];
  }

  return route
    .map((point) => {
      const lat = Number(
        point?.lat ??
        point?.latitude
      );

      const lng = Number(
        point?.lng ??
        point?.lon ??
        point?.longitude
      );

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        return null;
      }

      if (
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      ) {
        return null;
      }

      return {
        lat,
        lng,
      };
    })
    .filter(Boolean);
}

// ============================================================
// CREATE AIS BOUNDING BOXES
// ============================================================

function normalizeLongitude(lng) {
  let value = lng;
  while (value > 180) value -= 360;
  while (value < -180) value += 360;
  return value;
}

function createRouteBoundingBoxes(route, corridorKm) {
  if (!Array.isArray(route) || route.length < 2) {
    return [];
  }

  const boxes = [];
  const seen = new Set();
  const latMargin = corridorKm / 111.32;

  // Split long route segments by geographic length. This prevents a sparse
  // route from producing one oversized AIS box that misses parts of the path.
  for (let i = 0; i < route.length - 1; i += 1) {
    const start = route[i];
    const end = route[i + 1];

    const segmentKm = haversineDistanceKm(
      start.lat,
      start.lng,
      end.lat,
      end.lng
    );

    const parts = Math.max(1, Math.ceil(segmentKm / 180));

    for (let part = 0; part < parts; part += 1) {
      const t0 = part / parts;
      const t1 = (part + 1) / parts;

      const lat0 = start.lat + (end.lat - start.lat) * t0;
      const lat1 = start.lat + (end.lat - start.lat) * t1;

      // Interpolate longitude along the shortest dateline-aware path.
      const deltaLng = normalizeLongitudeDeltaDegrees(end.lng - start.lng);
      const lng0 = normalizeLongitude(start.lng + deltaLng * t0);
      const lng1 = normalizeLongitude(start.lng + deltaLng * t1);

      const centerLat = (lat0 + lat1) / 2;
      const cosLat = Math.max(
        0.15,
        Math.cos(centerLat * Math.PI / 180)
      );
      const lngMargin = corridorKm / (111.32 * cosLat);

      const south = clamp(
        Math.min(lat0, lat1) - latMargin,
        -90,
        90
      );
      const north = clamp(
        Math.max(lat0, lat1) + latMargin,
        -90,
        90
      );

      // Build an unwrapped interval around the segment. If it crosses the
      // dateline, split it into two legal AIS longitude boxes.
      const rawWest = Math.min(lng0, lng1) - lngMargin;
      const rawEast = Math.max(lng0, lng1) + lngMargin;

      const pushBox = (west, east) => {
        const safeWest = Math.max(-180, Math.min(180, west));
        const safeEast = Math.max(-180, Math.min(180, east));
        if (safeEast <= safeWest) return;

        const key = `${south.toFixed(4)},${safeWest.toFixed(4)},${north.toFixed(4)},${safeEast.toFixed(4)}`;
        if (seen.has(key)) return;
        seen.add(key);

        boxes.push([
          [south, safeWest],
          [north, safeEast],
        ]);
      };

      if (rawWest >= -180 && rawEast <= 180) {
        pushBox(rawWest, rawEast);
      } else if (rawWest < -180 && rawEast <= 180) {
        pushBox(180 + rawWest, 180);
        pushBox(-180, rawEast);
      } else if (rawWest >= -180 && rawEast > 180) {
        pushBox(rawWest, 180);
        pushBox(-180, rawEast - 360);
      } else {
        // Extremely wide polar/large-corridor case.
        pushBox(-180, 180);
      }
    }
  }

  // AISStream subscriptions should remain reasonably focused. The route is
  // split at ~180 km above, so normal routes stay well below this limit.
  return boxes.slice(0, MAX_ROUTE_SEGMENTS * 4);
}

// ============================================================
// POSITION REPORT
// ============================================================

function updatePosition(message) {
  const report =
    message?.Message?.PositionReport ||
    message?.Message?.StandardClassBPositionReport ||
    message?.Message?.ExtendedClassBPositionReport;

  if (!report) return;

  const mmsi = getMMSI(message, report);
  if (!mmsi) return;

  // AISStream supplies the live position in MetaData for PositionReport
  // messages. Keep the report-level fallback for alternate message formats.
  const lat = Number(
    message?.MetaData?.Latitude ??
    message?.MetaData?.latitude ??
    report?.Latitude ??
    report?.latitude
  );

  const lng = Number(
    message?.MetaData?.Longitude ??
    message?.MetaData?.longitude ??
    report?.Longitude ??
    report?.longitude
  );

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return;
  }

  const key = String(mmsi);
  const existing = vessels.get(key) || {};

  const speed = Number(
    report?.Sog ??
    report?.SOG ??
    report?.sog
  );

  const cog = Number(
    report?.Cog ??
    report?.COG ??
    report?.cog
  );

  const trueHeading = Number(
    report?.TrueHeading ??
    report?.Trueheading ??
    report?.trueHeading
  );

  let heading = existing.heading || 0;

  if (Number.isFinite(trueHeading) && trueHeading >= 0 && trueHeading <= 360) {
    heading = trueHeading;
  } else if (Number.isFinite(cog) && cog >= 0 && cog <= 360) {
    heading = cog;
  }

  const distance = currentRoute.length >= 2
    ? distanceToRouteKm(lat, lng, currentRoute)
    : Infinity;

  if (currentRoute.length >= 2 && distance > currentCorridorKm) {
    // Do not let an old in-memory vessel survive after it has left the route.
    vessels.delete(key);
    return;
  }

  const vessel = {
    ...existing,
    id: key,
    mmsi,
    lat,
    lng,
    speed: Number.isFinite(speed) ? speed : (existing.speed || 0),
    heading,
    navigationStatus:
      report?.NavigationalStatus ??
      report?.NavigationStatus ??
      existing.navigationStatus ??
      null,
    distanceToRouteKm:
      Number.isFinite(distance) ? Number(distance.toFixed(1)) : null,
    lastUpdate: new Date().toISOString(),
  };

  vessels.set(key, vessel);
  routeVesselsAccepted = vessels.size;
  lastMessageAt = Date.now();
}

// ============================================================
// STATIC DATA
// ============================================================

function updateStaticData(message) {
  const data =
    message?.Message
      ?.ShipStaticData ||
    message?.Message
      ?.StaticDataReport;

  if (!data) {
    return;
  }

  const mmsi =
    getMMSI(
      message,
      data
    );

  if (!mmsi) {
    return;
  }

  const key =
    String(mmsi);

  const existing =
    vessels.get(key) || {
      id: key,
      mmsi,

      lat: null,
      lng: null,

      speed: 0,
      heading: 0,
    };

  const shipType =
    Number(
      data.Type ??
      data.ShipType ??
      data.ShipAndCargoType ??
      existing.shipType ??
      0
    );

  const typeInfo =
    normalizeShipType(
      shipType
    );

  const name =
    cleanText(
      data.Name ??
      data.VesselName ??
      data.ShipName ??
      existing.name
    );

  const callSign =
    cleanText(
      data.CallSign ??
      data.CallSignString ??
      existing.callSign
    );

  const destination =
    cleanText(
      data.Destination ??
      data.DestinationString ??
      existing.destination
    );

  const imo =
    Number(
      data.ImoNumber ??
      data.IMO ??
      data.Imo ??
      existing.imo ??
      0
    );

  vessels.set(
    key,
    {
      ...existing,

      id: key,

      mmsi,

      name:
        name ||
        existing.name ||
        `MMSI ${mmsi}`,

      callSign,

      destination,

      imo:
        Number.isFinite(imo) &&
        imo > 0
          ? imo
          : existing.imo ||
            null,

      shipType:
        shipType > 0
          ? shipType
          : existing.shipType ||
            null,

      type:
        typeInfo.type,

      typeLabel:
        typeInfo.typeLabel,

      color:
        typeInfo.color,

      lastStaticUpdate:
        new Date().toISOString(),
    }
  );
}

// ============================================================
// MESSAGE HANDLER
// ============================================================

function handleMessage(rawMessage) {
  try {
    // AISStream sends binary WebSocket frames containing UTF-8 JSON.
    // ws exposes both text and binary frames through the message event.
    const text = Buffer.isBuffer(rawMessage)
      ? rawMessage.toString('utf8')
      : rawMessage.toString();

    const message = JSON.parse(text);
    messagesReceived += 1;
    lastMessageType = message?.MessageType || 'Unknown';

    if (!firstMessageLogged) {
      firstMessageLogged = true;
      console.log(`[AIS] First AIS message received: ${lastMessageType}`);
    }

    if (message?.MessageType === 'SubscriptionConfirmation') {
      console.log(
        `[AIS] Subscription confirmed. Compression: ${
          message?.Message?.CompressionEnabled ? 'enabled' : 'disabled'
        }`
      );
      return;
    }

    if (message?.MessageType === 'UnknownMessage') {
      return;
    }

    if (message?.MessageType === 'PositionReport' ||
        message?.MessageType === 'StandardClassBPositionReport' ||
        message?.MessageType === 'ExtendedClassBPositionReport') {
      positionMessagesReceived += 1;
    }

    if (message?.MessageType === 'ShipStaticData' ||
        message?.MessageType === 'StaticDataReport') {
      staticMessagesReceived += 1;
    }

    updatePosition(message);
    updateStaticData(message);
  } catch (error) {
    console.error('[AIS] Message error:', error.message);
  }
}

// ============================================================
// DISCONNECT
// ============================================================

function disconnectAISStream() {
  if (reconnectTimer) {
    clearTimeout(
      reconnectTimer
    );

    reconnectTimer = null;
  }

  if (socket) {
    try {
      socket.removeAllListeners();

      socket.close();

    } catch {
      // Ignore close errors.
    }
  }

  socket = null;

  connected = false;
}

// ============================================================
// CONNECT
// ============================================================

function connectAISStream() {
  if (!API_KEY) {
    console.error(
      '[AIS] AISSTREAM_API_KEY is missing.'
    );

    console.error(
      '[AIS] Add it to backend/.env'
    );

    return;
  }

  if (
    currentBoundingBoxes.length === 0
  ) {
    console.log(
      '[AIS] Waiting for a calculated route.'
    );

    return;
  }

  if (
    started &&
    connected
  ) {
    return;
  }

  started = true;

  console.log(
    '[AIS] Connecting to AISStream...'
  );

  try {
    socket =
      new WebSocket(
        AISSTREAM_URL,
        { perMessageDeflate: true }
      );

    socket.on(
      'open',
      () => {
        connected = true;

        console.log(
          '[AIS] AISStream connected'
        );

        const subscription = {
          APIKey: API_KEY,
          BoundingBoxes: currentBoundingBoxes,
          // Keep the stream focused. ShipStaticData is enough for Class-A
          // vessel identity/type/destination data; PositionReport provides
          // the live coordinates.
          FilterMessageTypes: [
            'PositionReport',
            'ShipStaticData',
          ],
        };

        socket.send(
          JSON.stringify(
            subscription
          )
        );

        console.log(
          `[AIS] Subscription sent with ${
            currentBoundingBoxes.length
          } route area(s)`
        );
      }
    );

    socket.on(
      'message',
      (data) => {
        handleMessage(data);
      }
    );

    socket.on(
      'error',
      (error) => {
        console.error(
          '[AIS] WebSocket error:',
          error.message
        );
      }
    );

    socket.on(
      'close',
      () => {
        connected = false;

        socket = null;

        console.log(
          '[AIS] AISStream disconnected.'
        );

        scheduleReconnect();
      }
    );

  } catch (error) {
    connected = false;

    socket = null;

    console.error(
      '[AIS] Connection error:',
      error.message
    );

    scheduleReconnect();
  }
}

// ============================================================
// RECONNECT
// ============================================================

function scheduleReconnect() {
  if (
    reconnectTimer ||
    currentBoundingBoxes.length === 0
  ) {
    return;
  }

  reconnectTimer =
    setTimeout(
      () => {
        reconnectTimer =
          null;

        started = false;

        connectAISStream();
      },
      RECONNECT_DELAY_MS
    );
}

// ============================================================
// UPDATE ROUTE
// ============================================================

function setRoute(
  route,
  corridorKm = DEFAULT_CORRIDOR_KM
) {
  const normalizedRoute =
    normalizeRoute(route);

  if (
    normalizedRoute.length < 2
  ) {
    throw new Error(
      'Route must contain at least two valid coordinates.'
    );
  }

  const safeCorridor =
    clamp(
      Number(corridorKm) ||
        DEFAULT_CORRIDOR_KM,
      10,
      300
    );

  currentRoute =
    normalizedRoute;

  currentCorridorKm =
    safeCorridor;

  currentBoundingBoxes =
    createRouteBoundingBoxes(
      currentRoute,
      currentCorridorKm
    );

  // Clear previous route vessels.
  vessels.clear();
  routeVesselsAccepted = 0;
  messagesReceived = 0;
  positionMessagesReceived = 0;
  staticMessagesReceived = 0;
  lastMessageType = null;
  firstMessageLogged = false;

  lastMessageAt = null;

  // Restart AIS subscription
  disconnectAISStream();

  started = false;

  console.log(
    `[AIS] New route received.`
  );

  console.log(
    `[AIS] Route points: ${currentRoute.length}`
  );

  console.log(
    `[AIS] Corridor: ${currentCorridorKm} km`
  );

  console.log(
    `[AIS] Bounding boxes: ${currentBoundingBoxes.length}`
  );

  connectAISStream();

  return {
    routePoints:
      currentRoute.length,

    corridorKm:
      currentCorridorKm,

    boundingBoxes:
      currentBoundingBoxes.length,

    connected,
  };
}

// ============================================================
// CLEAN OLD VESSELS
// ============================================================

function cleanupVessels() {
  const now =
    Date.now();

  for (
    const [
      key,
      vessel,
    ] of vessels.entries()
  ) {
    if (
      !vessel.lastUpdate
    ) {
      continue;
    }

    const lastUpdate =
      new Date(
        vessel.lastUpdate
      ).getTime();

    if (
      !Number.isFinite(
        lastUpdate
      )
    ) {
      continue;
    }

    if (
      now - lastUpdate >
      VESSEL_TIMEOUT_MS
    ) {
      vessels.delete(
        key
      );
    }
  }
}

setInterval(
  cleanupVessels,
  60 * 1000
);

// ============================================================
// GET VESSELS
// ============================================================

function getVessels() {
  cleanupVessels();

  const result = [];

  for (
    const vessel of
      vessels.values()
  ) {
    if (
      !Number.isFinite(
        vessel.lat
      ) ||
      !Number.isFinite(
        vessel.lng
      )
    ) {
      continue;
    }

    result.push({
      id:
        vessel.id,

      mmsi:
        vessel.mmsi,

      name:
        vessel.name ||
        `MMSI ${vessel.mmsi}`,

      lat:
        vessel.lat,

      lng:
        vessel.lng,

      speed:
        Number.isFinite(
          vessel.speed
        )
          ? Number(
              vessel.speed.toFixed(1)
            )
          : 0,

      heading:
        Number.isFinite(
          vessel.heading
        )
          ? Number(
              vessel.heading.toFixed(0)
            )
          : 0,

      type:
        vessel.type ||
        'other',

      typeLabel:
        vessel.typeLabel ||
        'Other / Unknown',

      color:
        vessel.color ||
        SHIP_TYPES.other.color,

      shipType:
        vessel.shipType ||
        null,

      imo:
        vessel.imo ||
        null,

      callSign:
        vessel.callSign ||
        '',

      destination:
        vessel.destination ||
        '',

      navigationStatus:
        vessel.navigationStatus ??
        null,

      distanceToRouteKm:
        vessel.distanceToRouteKm ??
        null,

      lastUpdate:
        vessel.lastUpdate ||
        null,
    });
  }

  // Closest ships to route first.
  result.sort(
    (a, b) => {
      const aDistance =
        Number.isFinite(
          a.distanceToRouteKm
        )
          ? a.distanceToRouteKm
          : Infinity;

      const bDistance =
        Number.isFinite(
          b.distanceToRouteKm
        )
          ? b.distanceToRouteKm
          : Infinity;

      return (
        aDistance -
        bDistance
      );
    }
  );

  return result.slice(
    0,
    MAX_VESSELS
  );
}

// ============================================================
// EXPRESS ROUTES
// ============================================================

function registerAISRoutes(app) {

  // ----------------------------------------------------------
  // GET /api/ais/vessels
  // ----------------------------------------------------------

  app.get(
    '/api/ais/vessels',
    (req, res) => {
      const vesselList =
        getVessels();

      res.json({
        success: true,

        connected,

        count:
          vesselList.length,

        routeActive:
          currentRoute.length >= 2,

        corridorKm:
          currentCorridorKm,

        lastMessageAt:
          lastMessageAt
            ? new Date(
                lastMessageAt
              ).toISOString()
            : null,

        vessels:
          vesselList,
      });
    }
  );

  // ----------------------------------------------------------
  // GET /api/ais/status
  // ----------------------------------------------------------

  app.get(
    '/api/ais/status',
    (req, res) => {
      res.json({
        success: true,

        connected,

        routeActive:
          currentRoute.length >= 2,

        routePoints:
          currentRoute.length,

        corridorKm:
          currentCorridorKm,

        boundingBoxes:
          currentBoundingBoxes.length,

        vesselCount:
          vessels.size,

        diagnostics: {
          messagesReceived,
          positionMessagesReceived,
          staticMessagesReceived,
          routeVesselsAccepted,
          lastMessageType,
        },

        lastMessageAt:
          lastMessageAt
            ? new Date(
                lastMessageAt
              ).toISOString()
            : null,
      });
    }
  );

  // ----------------------------------------------------------
  // POST /api/ais/route-area
  //
  // Frontend sends the calculated sea route here.
  // ----------------------------------------------------------

  app.post(
    '/api/ais/route-area',
    (req, res) => {
      try {
        const {
          route,
          corridorKm,
        } = req.body;

        if (
          !Array.isArray(route) ||
          route.length < 2
        ) {
          return res.status(400).json({
            success: false,

            message:
              'A route with at least two coordinates is required.',
          });
        }

        const result =
          setRoute(
            route,
            corridorKm
          );

        return res.json({
          success: true,

          message:
            'AIS route area updated.',

          ...result,
        });

      } catch (error) {
        console.error(
          '[AIS] Route area error:',
          error.message
        );

        return res.status(500).json({
          success: false,

          message:
            error.message,
        });
      }
    }
  );

  // ----------------------------------------------------------
  // DELETE /api/ais/route-area
  //
  // Clears the current route and stops AIS streaming.
  // ----------------------------------------------------------

  app.delete(
    '/api/ais/route-area',
    (req, res) => {
      currentRoute = [];

      currentBoundingBoxes = [];

      vessels.clear();
      routeVesselsAccepted = 0;
      messagesReceived = 0;
      positionMessagesReceived = 0;
      staticMessagesReceived = 0;
      lastMessageType = null;
      firstMessageLogged = false;

      disconnectAISStream();

      started = false;

      lastMessageAt = null;

      res.json({
        success: true,

        message:
          'AIS route area cleared.',

        connected: false,

        vesselCount: 0,
      });
    }
  );
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  connectAISStream,

  registerAISRoutes,

  getVessels,

  setRoute,
};