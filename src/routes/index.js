const express = require("express");
const router = express.Router();
const mysqlConnection = require("../database");
const customerController = require("../controllers/indexController");
var md_auth=require('../middlewares/authenticated');


//RUTAS DE CENTROS DE SALUD

//Todos los centros de salud
router.get(
  "/apifactprocessmed/centrodesalud",md_auth.ensureAuth,
  customerController.getCentrosdeSalud
);
//Centro de salud indicado en ID
router.get(
  "/apifactprocessmed/centrodesalud/:id",md_auth.ensureAuth,
  customerController.getCentrodeSaludById
);
//Por centro de salud indicado en ID especialistas asociados en menu centros de salud>especialistas
router.get(
  "/apifactprocessmed/centrodesaludespecialistas/:id",md_auth.ensureAuth,
  customerController.getByCentrodesaludEspecialistas
);
//NUEVO
//Por centro de salud indicado en ID especialidades asociadas
router.get(
  "/apifactprocessmed/centrodesaludespecialidad/:id",md_auth.ensureAuth,
  customerController.getByCentrodesaludEspecialidad
);

//Desplegable de Centro de salud>Especialidades
router.get(
  "/apifactprocessmed/centrodesaludespecialidadD",md_auth.ensureAuth,
customerController.getCentrosdeSaludDesplegable
);
;

//RUTA DE CONSENTIMIENTOS

//MENU Consentimientos >Cuadro resumen
router.get(
  "/apifactprocessmed/consentimientosFNF",md_auth.ensureAuth,
  customerController.getConsentimientosFNF
)

//Menu Consentimientos>Detalle (vista creada vw_reporte)
router.get(
  "/apifactprocessmed/consentimientosvwreporte",md_auth.ensureAuth,
  customerController.getConsentimientosvwreporte
)

//CONSENTIMIENTOS GRAFICOS

//Grafico 1 - Numero de consentimientos por año y con estado=1
//Grafico 2
router.get(
  "/apifactprocessmed/consentimientosG1",md_auth.ensureAuth,
  customerController.getConsentimientosG1
);

//Grafico 1.- Numero de consentimientos por week (dias de la semana) y con estado=1
router.get(
  "/apifactprocessmed/consentimientosG1Week",md_auth.ensureAuth,
  customerController.getConsentimientosG1Week
);

//Grafico 1.- Numero de consentimientos por month (meses) y con estado=1
router.get(
  "/apifactprocessmed/consentimientosG1Month",md_auth.ensureAuth,
  customerController.getConsentimientosG1Month
);

//Grafico 2.- Numero de consentimientos por año y firma casa (firma_casa=1) o firma en local(firma_casa=0) con estado 1
//El grafico 2 se carga al principio con estos datos
//Menu Consentimientos>Firmados

router.get(
  "/apifactprocessmed/consentimientosG2",md_auth.ensureAuth,
  customerController.getConsentimientosG2
);
//Grafico 2.- Numero de consentimientos por week (dias de la semana) y firma casa (firma_casa=1) o firma en local(firma_casa=0) con estado 1
//El grafico 2 se carga al principio con estos datos
router.get(
  "/apifactprocessmed/consentimientosG2Week",md_auth.ensureAuth,
  customerController.getConsentimientosG2Week
);
//Grafico 2.- Numero de consentimientos por month (meses) y con estado=1
router.get(
  "/apifactprocessmed/consentimientosG2Month",md_auth.ensureAuth,
  customerController.getConsentimientosG2Month
);
//Grafico 3.- Numero de todos consentimientos agrupados por estado
router.get(
  "/apifactprocessmed/consentimientosG3",md_auth.ensureAuth,
  customerController.getConsentimientosG3
);
//Grafico 4.- Numero de todos consentimientos agrupados por estado y año
router.get(
  "/apifactprocessmed/consentimientosG4",md_auth.ensureAuth,
  customerController.getConsentimientosG4
);

//RUTAS DE ESPECIALIDADES

//Todas las especialidades
router.get(
  "/apifactprocessmed/especialidads",md_auth.ensureAuth,
  customerController.getEspecialidad
);
//Especialidad indicada en ID
router.get(
  "/apifactprocessmed/especialidad/:id",md_auth.ensureAuth,
  customerController.getEspecialidadById
);

//Por especialidad indicada en ID especialistas asociados
router.get(
  "/apifactprocessmed/especialidadespecialistas/:id",md_auth.ensureAuth,
  customerController.getByEspecialidadEspecialistas
);
//RUTAS DE ESPECIALIDAD CENTRO SALUD

//Todas las especialidades centro salud
router.get(
  "/apifactprocessmed/especialidadcentrosaluds",md_auth.ensureAuth,
  customerController.getEspecialidadCentrosalud
);

//Especialidad centro salud indicada en ID
router.get(
  "/apifactprocessmed/especialidadcentrosalud/:id",md_auth.ensureAuth,
  customerController.getEspecialidadCentrosaludById
);

//Por especialidad centro salud consentimientos asociados
// Menu Especialidades >Consentimientos
router.get(
  "/apifactprocessmed/especialidadcentrosaludconsentimientos/:id",md_auth.ensureAuth,
  customerController.getByEspecialidadCentrosaludConsentimientos
);

//RUTAS DE ESPECIALISTAS

//Todos los especialistas de indice 
//MENU especialistas>Indice
router.get(
  "/apifactprocessmed/especialistas",md_auth.ensureAuth,
  customerController.getEspecialista
);
//MENU especialistas>Consentimientos
//Desplegable de especialistas
router.get(
  "/apifactprocessmed/especialistasD",md_auth.ensureAuth,
  customerController.getEspecialistaD
);

//Especialista indicado en ID
router.get(
  "/apifactprocessmed/especialista/:id",md_auth.ensureAuth,
  customerController.getEspecialistaById
);
//Por especialista indicado en el desplegable devuelve todos los registros de consentimientos de ese especialista
router.get(
  "/apifactprocessmed/especialistaconsentimientos/:id",md_auth.ensureAuth,
  customerController.getByEspecialistaConsentimientos
);
//RUTAS DE PACIENTES

//MENU: Pacientes>Indice
//Todos los pacientes
router.get("/apifactprocessmed/pacientes", md_auth.ensureAuth,customerController.getPaciente);

//Paciente indicado en ID
router.get(
  "/apifactprocessmed/paciente/:no_historia_c",md_auth.ensureAuth,
  customerController.getPacienteById
);

//MENU Pacientes>Consentimientos
//Desplegable
router.get("/apifactprocessmed/pacientesD", md_auth.ensureAuth,customerController.getPacienteD);

//Por paciente consentimientos asociados
router.get(
  "/apifactprocessmed/pacienteconsentimientos/:id",md_auth.ensureAuth,
  customerController.getByPacienteConsentimientos
);

//RUTAS DE PROCEDIMIENTOS

//Todos los procedimientos
router.get(
  "/apifactprocessmed/procedimientos",md_auth.ensureAuth,
  customerController.getProcedimiento
);

//Procedimiento indicado en ID
router.get(
  "/apifactprocessmed/procedimiento/:id",md_auth.ensureAuth,
  customerController.getProcedimientoById
);

//RUTA DE PROCEDIMIENTOS CENTRO SALUD para menu consentimientos

//Todos los procedimientos centro salud con los campos id id_centro_salud y id_procedimiento para desplegable de consentimientos>procedimientos
//Menu Consentimientos > Procedimientos
router.get(
  "/apifactprocessmed/procedimientocentrosaludD",md_auth.ensureAuth,
  customerController.getProcedimientoCentroSaludD
);

//Procedimiento centro salud indicado en el ID
router.get(
  "/apifactprocessmed/procedimientocentrosalud/:id",md_auth.ensureAuth,
  customerController.getProcedimientoCentroSaludById
);

//MENU Procedimientos >Consentimientos
//Por procedimiento centro salud indicado en el ID consentimientos asociados
router.get(
  "/apifactprocessmed/procedimientocentrosaludconsentimientos/:id",md_auth.ensureAuth,
  customerController.getByProcedimientoCentroSaludconsentimentos
);


//RUTA DE USUARIOS

//Login de usuario
router.post(
  "/apifactprocessmed/login",
  customerController.login
)

module.exports = router;
