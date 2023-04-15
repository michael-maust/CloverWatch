import { useCallback, useEffect, useRef, useState } from 'react';
import supabase from '~/lib/supabase';
import { Layer, Map, MapRef, Source } from 'react-map-gl';

import MapDrawControl from './MapDrawControl';

import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2pzdHVja3kiLCJhIjoiY2xhMzlvcnhlMG94czNwbWhzN3Z3Z3V6cCJ9.FYRlIp7y4CKe7qhm66VsTQ';

interface Feature<Geometry, Properties> {
  id?: string | number;
  type: 'Feature';
  geometry: Geometry;
  properties: Properties;
}

interface Geometry {
  type: 'Polygon';
  coordinates: number[][][];
}

interface Properties {
  name?: string;
}

interface Field {
  id: number,
  name: string,
  created_at: Date,
}


interface FieldMapUpdateProps {
  use?: 'display' | 'create' | 'update',
  fieldID?: number
}

export default function FieldMapUpdate({use = 'display', fieldID}: FieldMapUpdateProps) {
  const mapRef = useRef<MapRef>(null);
  const [features, setFeatures] = useState<Feature<Geometry, Properties>[]>([]);
  const [currentFeatures, setCurrentFeatures] = useState<Feature<Geometry, Properties>[]>([]);
  const [fieldName, setFieldName] = useState('');

  useEffect(() => {
    if (use != 'update') {
      return;
    }

    if (!fieldID) {
      //Todo error handling.
      return;
    }

    populateFieldToUpdate();
  }, [])

  const populateFieldToUpdate = async () => {
    const { data: coordinateIDsFromDB } = await supabase.from('fields_x_coordinates').select('*').eq('field_id', fieldID);
    const processedCoordinateIDs = coordinateIDsFromDB?.map(c => c.coordinate_id);
    if (!processedCoordinateIDs) {
      //TODO: handle errors.
      return;
    }

    const { data: coordinatesFromDB } = await supabase.from('coordinates').select('*').in('id', processedCoordinateIDs)
    const processedCoordinates = coordinatesFromDB?.map((c) => [c.latitude, c.longitude]);
    if (!processedCoordinates) {
      //TODO: handle errors.
      return;
    }

    const fieldFeature: Feature<Geometry, Properties> = {
      id: 'first-feature',
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [processedCoordinates]
      }
    }

    setCurrentFeatures([fieldFeature]);
  }

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
        ref={mapRef}
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
        <Source id='current-field' type='geojson' data={{type: 'FeatureCollection', features: currentFeatures}}>
          <Layer
            id='current-field-layer'
            type='fill'
            paint={{
              'fill-color': '#FF0000',
              'fill-opacity': 0.3,
            }}
          />
        </Source>
      </Map>
      <input value={fieldName} onChange={(e) => setFieldName(e.target.value)} type='text' />
      <button onClick={() => console.log(features)}>Save</button>
    </div>
  )
}