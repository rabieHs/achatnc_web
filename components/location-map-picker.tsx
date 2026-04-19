'use client';

import { useEffect, useMemo, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L, { type Map as LeafletMap, type Marker } from 'leaflet';

const defaultCenter: [number, number] = [-22.2758, 166.4581]; // Nouméa

interface Props {
  value: { lat: number; lng: number } | null;
  onChange: (value: { lat: number; lng: number }) => void;
  readOnly?: boolean;
  radiusMeters?: number;
  height?: number | string;
}

export function LocationMapPicker({
  value,
  onChange,
  readOnly = false,
  radiusMeters,
  height = 320,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const initial = useMemo<[number, number]>(
    () => (value ? [value.lat, value.lng] : defaultCenter),
    // only compute once
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: initial,
      zoom: value ? 13 : 10,
      zoomControl: true,
      dragging: true,
      scrollWheelZoom: !readOnly,
      doubleClickZoom: !readOnly,
      touchZoom: !readOnly,
      boxZoom: !readOnly,
      keyboard: !readOnly,
    });
    mapRef.current = map;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map);

    const pinIcon = L.divIcon({
      className: '',
      html: `<div style="width:26px;height:26px;border-radius:50%;background:#2563EB;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.25);"></div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });

    if (value) {
      markerRef.current = L.marker(initial, { icon: pinIcon }).addTo(map);
      if (radiusMeters) {
        circleRef.current = L.circle(initial, {
          radius: radiusMeters,
          color: '#2563EB',
          fillColor: '#2563EB',
          fillOpacity: 0.12,
          weight: 1,
        }).addTo(map);
      }
    }

    if (!readOnly) {
      map.on('click', (e) => {
        const latlng: [number, number] = [e.latlng.lat, e.latlng.lng];
        if (markerRef.current) {
          markerRef.current.setLatLng(latlng);
        } else {
          markerRef.current = L.marker(latlng, { icon: pinIcon }).addTo(map);
        }
        onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    }

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden rounded-xl border"
      style={{ height }}
    />
  );
}
