"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon issue with React/Webpack
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
  position: { lat: number; lng: number };
  onChange: (position: { lat: number; lng: number }) => void;
}

function LocationMarker({ position, onChange }: MapPickerProps) {
  const [pos, setPos] = useState<L.LatLng | null>(
    position.lat !== 0 || position.lng !== 0 ? new L.LatLng(position.lat, position.lng) : null
  );

  const map = useMapEvents({
    click(e) {
      setPos(e.latlng);
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  // Re-center map if initial position is valid and we haven't clicked yet
  useEffect(() => {
    if (position.lat !== 0 || position.lng !== 0) {
      map.flyTo([position.lat, position.lng], map.getZoom());
    }
  }, []);

  return pos === null ? null : (
    <Marker 
      position={pos} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPos(pos);
          onChange({ lat: pos.lat, lng: pos.lng });
        }
      }}
    />
  );
}

export default function MapPicker({ position, onChange }: MapPickerProps) {
  // Default to Indonesia center if 0,0
  const center = position.lat !== 0 || position.lng !== 0 
    ? [position.lat, position.lng] 
    : [-2.5489, 118.0149]; // Center of Indonesia

  return (
    <div className="h-[300px] w-full rounded-md overflow-hidden border border-slate-200">
      <MapContainer 
        center={center as [number, number]} 
        zoom={5} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} onChange={onChange} />
      </MapContainer>
    </div>
  );
}
