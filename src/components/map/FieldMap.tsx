import { useCallback, useEffect, useRef, useState } from 'react';
import { Layer, Map, MapRef, Source } from 'react-map-gl';

import MapDrawControl from './MapDrawControl';

import 'mapbox-gl/dist/mapbox-gl.css';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

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


interface FieldMapProps {
  use?: 'display' | 'create' | 'update',
  fieldID?: number
}

export default function FieldMap({ use = 'display', fieldID }: FieldMapProps) {
  const supabase = useSupabaseClient();
  const [features, setFeatures] = useState<Feature<Geometry, Properties>[]>([]);
  const [currentFeatures, setCurrentFeatures] = useState<Feature<Geometry, Properties>[]>([]);
  const [fieldName, setFieldName] = useState('');

  useEffect(() => {
    if (use === 'create') {
      return;
    }

    if (fieldID && use === 'update') {
      populateFieldToUpdate();
    }

    if (use === 'display') {
      populateFieldDisplay();
    }
  }, [])

  useEffect(() => {
    console.log(features)
    if (use === 'display') {
      return;
    }

    if (features.length > 0) {
      document.getElementsByClassName('mapbox-gl-draw_polygon')[0]?.setAttribute('disabled', 'true');
    } else {
      document.getElementsByClassName('mapbox-gl-draw_polygon')[0]?.removeAttribute('disabled');
    }
  }, [use, features])

  const populateFieldDisplay = async () => {
    const { data: fields, error } = await supabase
      .from('fields_x_coordinates')
      .select(`
        field:field_id ( id, name ),
        coordinate:coordinate_id ( latitude, longitude )
      `);

    const groupedFields = fields?.reduce((acc, field) => {
      const { id } = field.field;
      if (!acc[id]) {
        acc[id] = [];
      }
      acc[id].push(field);
      return acc;
    }, {});

    const display = Object.keys(groupedFields).map((key): Feature<Geometry, Properties> => {
      const field = groupedFields[key];

      return {
        id: field[0].field.id,
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: field.map((f: any) => [f.coordinate.latitude, f.coordinate.longitude])
        }
      }
    })

    setFeatures(display);
  }

  const populateFieldToUpdate = async () => {
    const { data: fieldDataFromDB } = await supabase.from('fields').select('*').eq('id', fieldID);
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

    setFieldName(fieldDataFromDB?.[0].name || '');
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
    let newFieldID;

    if (use === 'create') {
      const { data: fieldData, error: fieldError } = await supabase
        .from<Field>('fields')
        .insert({
          name: fieldName
        })

      newFieldID = fieldData?.[0]?.id;
    }

    if (use === 'update') {
      if (!fieldID) {
        // TODO: handle error.
        return;
      }

      const { data: fieldData, error: fieldError } = await supabase
        .from<Field>('fields')
        .update({
          name: fieldName
        })
        .eq('id', fieldID)
    }

    newFieldID = newFieldID ? newFieldID : fieldID;


    if (!newFieldID && !fieldID) {
      // TODO: error handling.
      return;
    }

    if (use === 'update') {
      if (!newFieldID || features.length == 0) {
        // TODO error checking.
        return;
      }

      const { data } = await supabase
        .from("fields_x_coordinates")
        .select("coordinate_id")
        .eq("field_id", newFieldID);

      const coordinatesIdsToDelete = data?.map((row) => row.coordinate_id);

      if (!coordinatesIdsToDelete) {
        //TODO error catching.
        return;
      }

      const { data: deleteDataCoordinatesxFields, error: deleteErrorCoordinatesxFields } = await supabase
        .from("fields_x_coordinates")
        .delete()
        .in("coordinate_id", coordinatesIdsToDelete);

      const { data: deleteData, error } = await supabase
        .from("coordinates")
        .delete()
        .in("id", coordinatesIdsToDelete);
    }

    if (features.length > 0) {
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
            field_id: newFieldID,
            coordinate_id: coordinateID,
          })
      }
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
        style={{ width: 880, height: 600 }}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {use !== 'display' &&
          <div>
            <MapDrawControl
              position='top-left'
              displayControlsDefault={false}
              controls={{
                polygon: true,
                trash: true,
              }}
              defaultMode="draw_polygon"
              onCreate={onUpdate}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
            <Source id='current-field' type='geojson' data={{ type: 'FeatureCollection', features: currentFeatures }}>
              <Layer
                id='current-field-layer'
                type='fill'
                paint={{
                  'fill-color': '#FF0000',
                  'fill-opacity': 0.3,
                }}
              />
            </Source>
          </div>
        }
        {use === 'display' &&
          <Source id='fields' type='geojson' data={{ type: 'FeatureCollection', features }}>
            <Layer
              id='fields'
              type='fill'
              paint={{
                'fill-color': '#FF0000',
                'fill-opacity': 0.3,
              }}
            />
          </Source>
        }
      </Map>
      <input value={fieldName} onChange={(e) => setFieldName(e.target.value)} type='text' />
      <button onClick={onSave}>Save</button>
    </div>
  )
}
