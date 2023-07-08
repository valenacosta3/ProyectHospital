var express = require('express');
var router = express.Router();
const { connection } = require('../database/conexion.js')
debugger
router.get('/', function (req, res, next) {
    connection.query('SELECT cm.id,cm.fecha, cm.id_paciente, pac.nombre as nombrePaciente, med.nombre as nombreMedico, med.apellido, med.consultorio FROM cita_medica cm, pacientes pac, medicos med WHERE cm.id_paciente = pac.cedula AND cm.id_medico= med.cedula', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            console.log(results)
            res.render('citas', { title: 'citas', citas: results })
        }
    });
});

router.get('/agregar-cita', function (req, res, next) {
    connection.query('SELECT cedula FROM pacientes', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            connection.query('SELECT especialidad FROM medicos', (error, results2) => {
                if (error) {
                    console.log("Error en la consulta", error)
                    res.status(500).send("Error en la consulta")
                } else {
                    res.render('registro-citas', { layout: 'registro', pacientes: results, medicos: results2 })
                }
            });
        }
    });
});

router.post('/agregar', function (req, res, next) {
    const cedula = req.body.cedula;
    const fecha = req.body.fecha;
    const especialidad = req.body.especialidad;
    connection.query(`SELECT cedula FROM medicos WHERE especialidad='${especialidad}'`, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            let cedulaMedico = results[0].cedula
            connection.query(`INSERT INTO cita_medica (id_paciente, id_medico, fecha) VALUES (${cedula},${cedulaMedico}, '${fecha}')`, (error, result) => {
                if (error) {
                    console.log("Ocurrio un error en la ejecución", error)
                    res.status(500).send("Error en la consulta");
                } else {
                    res.redirect('/citas');
                }
            });
        }
    });
})
//eliminar citas
router.get('/eliminar/:id', function (req, res, next) {
    const id = req.params.id
    connection.query(`DELETE FROM cita_medica WHERE id=${id}`, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.redirect('/citas')
        }
    });
});

module.exports = router;