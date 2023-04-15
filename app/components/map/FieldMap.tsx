import { useCallback, useEffect, useState } from 'react';
import { Map } from 'react-map-gl';
import type { DrawFeature } from '@mapbox/mapbox-gl-draw';

import MapDrawControl from './MapDrawControl';

import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2pzdHVja3kiLCJhIjoiY2xhMzlvcnhlMG94czNwbWhzN3Z3Z3V6cCJ9.FYRlIp7y4CKe7qhm66VsTQ';

interface FieldMapProps {
  use?: 'display' | 'create' | 'update'
}

export default function FieldMap({use = 'display'}: FieldMapProps) {
  const [features, setFeatures] = useState<DrawFeature[]>([]);

  useEffect(() => {
    if (use !== 'create') {
      return;
    }

    if (features.length > 0) {
      document.getElementsByClassName('mapbox-gl-draw_polygon')[0]?.setAttribute('disabled', 'true');
    } else {
      document.getElementsByClassName('mapbox-gl-draw_polygon')[0]?.removeAttribute('disabled');
    }
  }, [use, features])

  const onUpdate = useCallback(e => {
    setFeatures(currFeatures => {
      const newFeatures = [...currFeatures];
      for (const f of e.features) {
        newFeatures.push(f);
      }
      return newFeatures;
    });
  }, []);

  const onDelete = useCallback(e => {
    setFeatures(currFeatures => {
      let newFeatures = [...currFeatures]
      for (const f of e.features) {
        newFeatures = newFeatures.filter(cf => cf.id !== f.id)
      }
      return newFeatures;
    });
  }, []);

  return (
    <div>
      <Map
        initialViewState={{
          latitude: 37.8,
          longitude: -122.4,
          zoom: 14
        }}
        style={{width: 880, height: 600}}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <MapDrawControl
          position='top-left'
          displayControlsDefault={false}
          controls={{
            polygon: use == 'create',
            trash: use == 'create'
          }}
          defaultMode="draw_polygon"
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </Map>
      <button onClick={() => console.log(features)}>See features</button>
    </div>
  )
}