import { useCallback, useEffect, useState } from 'react';
import supabase from '~/lib/supabase';
import { Map } from 'react-map-gl';

import MapDrawControl from './MapDrawControl';

import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2pzdHVja3kiLCJhIjoiY2xhMzlvcnhlMG94czNwbWhzN3Z3Z3V6cCJ9.FYRlIp7y4CKe7qhm66VsTQ';

interface Feature {
  id: string;
  type: string;
  properties: Record<string, unknown>;
  geometry: Geometry;
}

interface Geometry {
  type: string;
  coordinates: number[][][];
}

interface Field {
  id: number,
  name: string,
  created_at: Date,
}


interface FieldMapProps {
  use?: 'display' | 'create' | 'update'
}

export default function FieldMap({use = 'display'}: FieldMapProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [fieldName, setFieldName] = useState('');

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

  const onSave = async () => {
    const { data: fieldData, error: fieldError } =  await supabase
      .from<Field>('fields')
      .insert({
        name: fieldName
      });

    const fieldID = fieldData?.[0]?.id;

    if (!fieldID) {
      // TODO: error handling.
      return;
    }

    for (const coordinate in features[0].geometry.coordinates[0]) {
      const { data, error: coordinateError } = await supabase
        .from('coordinates')
        .insert({
          latitude: features[0].geometry.coordinates[0][coordinate][0],
          longitude: features[0].geometry.coordinates[0][coordinate][1],
        })

      const coordinateID = data?.[0]?.id;

      if (!coordinateID) {
        // TODO: error handling.
        return;
      }

      const { error } = await supabase
        .from('fields_x_coordinates')
        .insert({
          field_id: fieldID,
          coordinate_id: coordinateID,
        })
    }
  }

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
      <input value={fieldName} onChange={(e) => setFieldName(e.target.value)} type='text' />
      <button onClick={onSave}>Save</button>
    </div>
  )
}