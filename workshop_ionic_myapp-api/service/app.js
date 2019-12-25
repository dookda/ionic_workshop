const express = require('express');
const app = express.Router();
const Pool = require('pg').Pool

const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'myapp',
    password: '1234',
    port: 5432,
});

app.get('/api/hello', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'hello world'
    })
});

app.post('/api/insert', (req, res) => {
    const { placename, placedesc, date, img, lng, lat } = req.body;
    const sql = `INSERT INTO survey (placename,placedesc,date,img,geom) VALUES
        ('${placename}','${placedesc}','${date}','${img}', ST_SetSRID(ST_GeomFromText('POINT(${lng} ${lat})'), 4326))`;
    db.query(sql).then(() => {
        res.status(200).json({
            status: 'success',
            message: 'insert data'
        });
    })
});

app.get('/api/getdata', (req, res) => {
    const sql = 'SELECT id,placename,placedesc,date,st_x(geom) as lon,st_y(geom) as lat FROM survey';
    let jsonFeatures = [];
    db.query(sql).then((data) => {
        var rows = data.rows;
        rows.forEach((e) => {
            let feature = {
                type: 'Feature',
                properties: e,
                geometry: {
                    type: 'Point',
                    coordinates: [e.lon, e.lat]
                }
            };
            jsonFeatures.push(feature);
        });
        let geoJson = {
            type: 'FeatureCollection',
            features: jsonFeatures
        };
        res.status(200).json(geoJson);
    });
});


app.get('/api/getdata/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT id,placename,placedesc,date,img,st_x(geom) as lon,st_y(geom) as lat FROM survey WHERE id=' + id;
    let jsonFeatures = [];
    db.query(sql).then((data) => {
        var rows = data.rows;
        rows.forEach((e) => {
            let feature = {
                type: 'Feature',
                properties: e,
                geometry: {
                    type: 'Point',
                    coordinates: [e.lon, e.lat]
                }
            };
            jsonFeatures.push(feature);
        });
        let geoJson = {
            type: 'FeatureCollection',
            features: jsonFeatures
        };
        res.status(200).json(geoJson);
    });
});

module.exports = app;