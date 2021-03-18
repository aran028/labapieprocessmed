const controller = {};
const mysqlConnection = require("../database");
var bcrypt=require("bcrypt-nodejs");
const jwt = require('jsonwebtoken');
var secret='clave_secreta_curso_desarrollar_red_social_angular';

//RUTAS DE CENTROS DE SALUD

//Todos Centros de salud.
//Menu Centros de Salud > Indice
controller.getCentrosdeSalud = async (req, res) => {
  mysqlConnection.query(
    `SELECT c.nombre, ci.nombre AS ciudad, p.nombre AS provincia,c.telefono,c.correo,c.ciglas AS NIF,c.id
    FROM centro_de_salud c, ciudad ci, provincia p 
    WHERE c.id_ciudad=ci.id AND ci.id_provincia=p.id
    ORDER BY c.nombre`,
    (err, rows, fields) => {
      if (err) throw error;
      res.json(rows);
    }
  );
};

//Menu Centros de Salud/Especialidad DESPLEGABLE
controller.getCentrosdeSaludDesplegable = async (req, res) => {
  mysqlConnection.query(
    `SELECT c.id, c.nombre, ci.nombre AS ciudad, p.nombre AS provincia,c.telefono,c.correo,c.ciglas AS NIF
    FROM centro_de_salud c, ciudad ci, provincia p 
    WHERE c.id_ciudad=ci.id AND ci.id_provincia=p.id
    ORDER BY c.nombre`,
    (err, rows, fields) => {
      if (err) throw error;
      res.json(rows);
    }
  );
};

//Centro de salud indicado en ID
controller.getCentrodeSaludById = async (req, res) => {
  const { id } = req.params;
  var sql = "SELECT * FROM `centro_de_salud` WHERE `id` = ?";
  mysqlConnection.query(sql, [id], (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
};
//Por centro de salud indicado en ID especialistas asociados
controller.getByCentrodesaludEspecialistas = async (req, res) => {
  const { id } = req.params;
  var sql = `SELECT c.ciglas AS NIF,c.nombre AS centro_salud,e.dni,  
    f.id AS id_especialidad, f.nombre AS Especialidad, ciu.nombre AS ciudad, e.firma,e.hash_firma 
    FROM centro_de_salud c, especialista e, especialidad f, ciudad ciu
WHERE c.id=e.id_centro_salud 
AND e.especialidad=f.id
AND e.ciudad=ciu.id
AND c.ciglas=?`;
  mysqlConnection.query(sql, [id], (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
};
//Por centro de salud indicado en ID especialidades asociadas
controller.getByCentrodesaludEspecialidad = async (req, res) => {
  const { id } = req.params;
  var sql = `SELECT c.ciglas AS NIF, c.nombre AS centro_salud, f.id AS id_especialidad, f.nombre AS Especialidad
    FROM centro_de_salud c, especialidad f, especialidad_centro_salud g
WHERE c.id=g.id_centro_salud 
AND f.id=g.id_especialidad
AND c.id=?`;
  mysqlConnection.query(sql, [id], (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
};

//RUTAS DE VISTA VW_REPORTE_CONSENTIMIENTO

//Consentimientos con todos los centros de salud con su fecha de creacion
//Menu Consentimientos>Detalle
controller.getConsentimientosvwreporte = async (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM vw_reporte_consentimiento",
    (err, rows, fields) => {
      if (err) throw error;
      res.json(rows);
    }
  );
};

//RUTAS DE CONSENTIMIENTOS

//Grafico 1 - Numero de consentimientos por año
 //"SELECT YEAR(`fecha_creacion`) AS Anio, COUNT(`id`) AS contador,  estado FROM`consentimiento` WHERE`estado` = '1' GROUP BY Anio",////

 //Grafico 2
 //Filtra todos los registros 
controller.getConsentimientosG1 = async (req, res) => {
  mysqlConnection.query(   
`SELECT YEAR(c.fecha_creacion) AS Anio, c.estado, COUNT(c.id) AS contador
 FROM consentimiento c, centro_de_salud cs, especialista e, especialidad esp, especialidad_centro_salud espc, procedimientos_centro_salud prc, procedimientos p, paciente pac
 WHERE estado=1
 AND c.especialista=e.id
 AND c.especialidad=espc.id
 AND e.especialidad=esp.id
 AND c.procedimiento=prc.id
 AND prc.id_procedimiento=p.id
 AND prc.id_centro_salud=cs.id
 AND c.paciente=pac.id
GROUP BY Anio`,

    (err, rows, fields) => {
      if (err) throw error;
      res.json(rows);
    }
  );
};
//Grafico 1.- Numero de consentimientos por week (dias de la semana) y con estado=1
controller.getConsentimientosG1Week = async (req, res) => {
  mysqlConnection.query(
    `SELECT YEAR(fecha_creacion) AS Anio, COUNT(id) AS contador,  DAYOFWEEK(fecha_creacion) AS Dia,
 estado FROM consentimiento WHERE estado = '1' 
GROUP BY Anio, Dia 
ORDER BY Anio ASC`,
    (err, rows, fields) => {
      if (err) throw error;
      res.json(rows);
    }
  );
};
//Grafico 1.- Numero de consentimientos por month (meses) y con estado=1
controller.getConsentimientosG1Month = async (req, res) => {
  mysqlConnection.query(
    `SELECT COUNT(id) AS contador, YEAR(fecha_creacion) AS Anio, MONTH(fecha_creacion) AS Mes, 
  estado FROM consentimiento WHERE estado = '1' 
GROUP BY Anio, Mes 
ORDER BY Anio ASC`,
    (err, rows, fields) => {
      if (err) throw error;
      res.json(rows);
    }
  );
};
//GRAFICO 2 

controller.getConsentimientosG2 = async (req, res) => {
  mysqlConnection.query(
    `SELECT YEAR(c.fecha_creacion) AS Anio, c.firma_casa, c.estado, COUNT(c.id) AS contador
 FROM consentimiento c, centro_de_salud cs, especialista e, especialidad esp, especialidad_centro_salud espc, procedimientos_centro_salud prc, procedimientos p, paciente pac
 WHERE c.especialista=e.id
 AND c.especialidad=espc.id
 AND e.especialidad=esp.id
 AND c.procedimiento=prc.id
 AND prc.id_procedimiento=p.id
 AND prc.id_centro_salud=cs.id
 AND c.paciente=pac.id
GROUP BY Anio, c.estado,c.firma_casa
ORDER BY Anio, c.estado,c.firma_casa ASC`,
    (err, rows, fields) => {
      if (err) throw error;
      res.json(rows);
    }
  );
};

//Consulta del menú Consentimientos> Firmados. Recoge todos los consentimientos los facturados y los pendientes de facturar
controller.getConsentimientosFNF = async (req, res) => {
  mysqlConnection.query(
    `SELECT YEAR(c.fecha_creacion) AS Anio, c.estado, COUNT(c.id) AS contador
 FROM consentimiento c, centro_de_salud cs, especialista e, especialidad esp, especialidad_centro_salud espc, procedimientos_centro_salud prc, procedimientos p, paciente pac
 WHERE 
 c.especialista=e.id
 AND c.especialidad=espc.id
 AND e.especialidad=esp.id
 AND c.procedimiento=prc.id
 AND prc.id_procedimiento=p.id
 AND prc.id_centro_salud=cs.id
 AND c.paciente=pac.id
GROUP BY Anio, c.estado
ORDER BY Anio, c.estado`,
    (err, rows, fields) => {
      if (err) throw error;
      res.json(rows);
    }
  );
};

//Grafico 2.- Numero de consentimientos por week (dias de la semana) y con estado=1
controller.getConsentimientosG2Week = async (req, res) => {
  mysqlConnection.query(
    `SELECT COUNT(id) AS contador, YEAR(fecha_creacion) AS Anio, DAYOFWEEK(fecha_creacion) AS Dia, firma_casa,
 estado FROM consentimiento WHERE estado = '1' 
GROUP BY Anio, firma_casa, Dia 
ORDER BY Anio ASC`,
    (err, rows, fields) => {
      if (err) throw error;
      res.json(rows);
    }
  );
};
//Grafico 2.- Numero de consentimientos por month (meses) y con estado=1
controller.getConsentimientosG2Month = async (req, res) => {
  mysqlConnection.query(
    `SELECT COUNT(id) AS contador, YEAR(fecha_creacion) AS Anio, MONTH(fecha_creacion) AS Mes, firma_casa,
  estado FROM consentimiento WHERE estado = '1' 
GROUP BY Anio, firma_casa, Mes 
ORDER BY Anio ASC`,
    (err, rows, fields) => {
      if (err) throw error;
      res.json(rows);
    }
  );
};
//Grafico 3.-Numero de todos consentimientos de tabla consentimiento agrupados con estado 0 y 1
//Pie
//Parte de todos los registros
controller.getConsentimientosG3 = async (req, res) => {
  mysqlConnection.query(
 `SELECT YEAR(c.fecha_creacion) AS Anio,c.estado, COUNT(c.id) AS contador
 FROM consentimiento c, centro_de_salud cs, especialista e, especialidad esp, especialidad_centro_salud espc, procedimientos_centro_salud prc, procedimientos p, paciente pac
 WHERE c.especialista=e.id
 AND c.especialidad=espc.id
 AND e.especialidad=esp.id
 AND c.procedimiento=prc.id
 AND prc.id_procedimiento=p.id
 AND prc.id_centro_salud=cs.id
 AND c.paciente=pac.id
GROUP BY Anio, c.estado
ORDER BY Anio, c.estado ASC`,
    (err, rows, fields) => {
      if (err) throw error;
      res.json(rows);
    }
  );
};
//Grafico 4.-Numero de todos consentimientos de tabla consentimiento agrupados por año con estado 0 y 1

controller.getConsentimientosG4 = async (req, res) => {
  mysqlConnection.query(
    `SELECT YEAR(c.fecha_creacion) AS Anio, c.estado, COUNT(c.id) AS contador FROM consentimiento c, centro_de_salud cs,    
    especialista e, especialidad esp, especialidad_centro_salud espc, procedimientos_centro_salud prc, procedimientos p, paciente pac
 WHERE c.especialista=e.id
 AND c.especialidad=espc.id
 AND e.especialidad=esp.id
 AND c.procedimiento=prc.id
 AND prc.id_procedimiento=p.id
 AND prc.id_centro_salud=cs.id
 AND c.paciente=pac.id
GROUP BY Anio, c.estado
ORDER BY Anio, c.estado ASC`,
    (err, rows, fields) => {
      if (err) throw error;
      res.json(rows);
    }
  );
};

// RUTAS DE ESPECIALIDADES

//Todas especialidades
controller.getEspecialidad = async (req, res) => {
  mysqlConnection.query("SELECT * FROM especialidad WHERE activo=1", (err, rows, fields) => {
    if (err) throw error;
    //res.json(response.rows);//Otra forma que funciona
    res.json(rows);
  });
};
//Especialista indicado en ID
controller.getEspecialidadById = async (req, res) => {
  const { id } = req.params;
  var sql = "SELECT * FROM `especialidad` WHERE `id` = ?";
  mysqlConnection.query(sql, [id], (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
};

controller.getByEspecialidadEspecialistas = async (req, res) => {
  const { id } = req.params;
  var sql = `SELECT e.dni, 
      e.id_centro_salud ,c.nombre As centro_salud, ciu.nombre AS ciudad_nombre,
        e.firma, e.hash_firma
    FROM centro_de_salud c, especialista e, especialidad a, ciudad ciu
WHERE a.id=e.especialidad
AND e.id_centro_salud=c.id
AND e.ciudad=ciu.id
AND a.id=?`;
  mysqlConnection.query(sql, [id], (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
};

//RUTAS DE ESPECIALIDAD CENTRO SALUD

//Listado de todas especialidades ordenadas por especialidad y luego por centro de salud

controller.getEspecialidadCentrosalud = async (req, res) => {
  mysqlConnection.query(
    `SELECT a.id,a.id_centro_salud,c.nombre AS Centro_Salud, a.id_especialidad, e.nombre AS Especialidad,a.activo FROM especialidad_centro_salud a, centro_de_salud c, especialidad e
WHERE a.id_centro_salud=c.id 
AND a.id_especialidad=e.id
AND a.activo=1
ORDER BY a.id_centro_salud,a.id_especialidad`,
    (err, rows, fields) => {
      if (err) throw err;
      res.json(rows);
    }
  );
};

// Especialidad centro de salud indicada en el id
controller.getEspecialidadCentrosaludById = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  var sql =
    "SELECT `id`, `id_centro_salud`, `id_especialidad`, `activo` FROM `especialidad_centro_salud` WHERE `id` = ?";
  mysqlConnection.query(sql, [id], (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
};

//Por especialidad centro salud indicado en ID consentimientos
controller.getByEspecialidadCentrosaludConsentimientos = async (req, res) => {
  const { id } = req.params;
  var sql = `SELECT c.id AS id_consentimiento, c.procedimiento, cs.nombre AS centro_salud, c.especialista,
  c.firma_casa, c.paciente, c.hash_fpaciente, 
  DATE_FORMAT(c.fecha_creacion, '%d/%m/%Y') AS fechacreacion
FROM especialidad_centro_salud a, consentimiento c, especialista e, especialidad f, paciente p, centro_de_salud cs
WHERE a.id=c.especialidad 
AND a.id_especialidad=f.id
AND a.id_centro_salud=cs.id
AND c.especialista=e.id
AND c.paciente=p.id
AND f.id=?`;
  mysqlConnection.query(sql, [id], (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
};

//RUTAS DE ESPECIALISTAS

//Todos Especialistas
controller.getEspecialista = async (req, res) => {
  mysqlConnection.query(
    `SELECT DISTINCT e.id, e.dni,
    CONCAT(e.nombre, ' ', e.apellido) nombre_completo,    
    es.nombre AS especialidad, c.nombre AS centro, ci.nombre AS ciudad,e.firma, e.hash_firma
      FROM especialista e, centro_de_salud c, ciudad ci, provincia pr, especialidad es, consentimiento co
WHERE e.id_centro_salud = c.id
AND e.ciudad=ci.id 
AND e.especialidad=es.id
AND e.provincia=pr.id
AND e.id=co.especialista
ORDER BY e.dni`,
     (err, rows, fields) => {
      if (err) throw err;
      res.json(rows);
     });
};
//Especialista indicado en ID
controller.getEspecialistaById = async (req, res) => {
  const { id } = req.params;
  var sql = "SELECT * FROM `especialista` WHERE `id` = ?";
  mysqlConnection.query(sql, [id], (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
};

//Desplegable de especialista>consentimientos
controller.getEspecialistaD = async (req, res) => {
  mysqlConnection.query('SELECT e.id, e.dni, ct.nombre AS centroSalud FROM especialista e, centro_de_salud ct where e.id_centro_salud=ct.id ORDER BY dni ',
 (err, rows, fields) => {
      if (err) throw err;
      res.json(rows);
     });
};


//Todas especialidades
controller.getEspecialidad = async (req, res) => {
  mysqlConnection.query("SELECT id,nombre FROM especialidad WHERE activo=1", (err, rows, fields) => {
    if (err) throw error;
    //res.json(response.rows);//Otra forma que funciona
    res.json(rows);
  });
};
//Por especialista indicado en ID obtener todos sus consentimientos menu especialista >consentimientos
controller.getByEspecialistaConsentimientos = async (req, res) => {
  const { id } = req.params;
  console.log(id);
 var sql = `SELECT c.id AS id_consentimiento, 
  f.nombre AS especialidad_nombre, 
  c.procedimiento, 
  c.video,
      c.mostrar_video,
      c.audio_aceptacion,
      c.paciente,
      c.hash_fpaciente,
      c.firma_casa,
      DATE_FORMAT(c.fecha_creacion, '%d/%m/%Y') AS fechacr
FROM paciente p, consentimiento c, especialidad f,  especialista e, especialidad_centro_salud esp
WHERE c.paciente=p.id
AND c.especialidad=esp.id
AND c.especialista=e.id
AND esp.id_especialidad=f.id
AND e.id=?`;
  mysqlConnection.query(sql, [id], (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
};

//RUTAS DE PACIENTES

//Todos Pacientes
controller.getPaciente = async (req, res) => {
  mysqlConnection.query(
    `SELECT DISTINCT  p.dni, CONCAT(p.apellido, ' ', p.nombre) nombre_completo, 
     DATE_FORMAT(p.fecha_nacimiento, '%d/%m/%Y') AS fechanaci,    
     p.direccion,p.correo,p.telefono
     FROM paciente p, consentimiento c 
      WHERE p.id=c.paciente
      AND p.id=c.paciente
      ORDER BY p.dni`,
    (err, rows, fields) => {
      if (err) throw error;
      res.json(rows);
    }
  );
};

//Paciente indicado  en no_historia_c
controller.getPacienteById = async (req, res) => {
  const { no_historia_c } = req.params;
  console.log(no_historia_c);
  var sql = "SELECT * FROM `paciente` WHERE `no_historia_c` = ?";
  mysqlConnection.query(sql, [no_historia_c], (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
};
//Todos Pacientes con consentimientos desplegable
controller.getPacienteD = async (req, res) => {
  mysqlConnection.query(
    "SELECT DISTINCT p.dni,p.id, p.nombre,p.apellido FROM paciente p, consentimiento c WHERE p.id=c.paciente ORDER BY dni",
    (err, rows, fields) => {
      if (err) throw error;
      res.json(rows);
    }
  );
};
//Por paciente indicado en ID consentimientos Menu Pacientes >Consentimientos
controller.getByPacienteConsentimientos = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  var sql = `SELECT c.id AS id_cto, p.dni, 
  f.nombre AS especialidad_nombre, 
  c.procedimiento, 
  c.video,
      c.mostrar_video,
      c.audio_aceptacion,
      c.firma_casa,
      c.completado_paciente,
      c.hash_fpaciente,
       DATE_FORMAT(c.fecha_creacion, '%d/%m/%Y') AS fechacr
FROM paciente p, consentimiento c, especialidad f, especialidad_centro_salud esp
WHERE c.paciente=p.id
AND c.especialidad=esp.id
AND esp.id_especialidad=f.id
AND p.dni=?`;
  mysqlConnection.query(sql, [id], (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
};





//RUTAS DE PROCEDIMIENTOS

//Todos Procedimientos
controller.getProcedimiento = async (req, res) => {
  mysqlConnection.query(
    `SELECT p.id, p.nombre, e.nombre AS especialidad
   FROM procedimientos p, especialidad e
   WHERE p.id_especialidad=e.id 
   ORDER BY p.nombre ASC`,
    (err, rows, fields) => {
      if (err) throw error;
      //res.json(response.rows);//Otra forma que funciona
      res.json(rows);
    }
  );
};
//Procedimiento indicado en ID
controller.getProcedimientoById = async (req, res) => {
  const { id } = req.params;
  var sql = "SELECT * FROM `procedimientos` WHERE `id` = ?";
  mysqlConnection.query(sql, [id], (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
};

//RUTAS DE PROCEDIMIENTOS CENTRO SALUD
//MENU consentimientos>procedimientos
//Procedimientos de todos los centros de salud y activos con varios campos para el desplegable
controller.getProcedimientoCentroSaludD = async (req, res) => {
  mysqlConnection.query(
    `SELECT pcs.id, cs.nombre, pcs.id_procedimiento,p.nombre AS procedimiento
    FROM procedimientos_centro_salud pcs,procedimientos p, centro_de_salud cs
    WHERE pcs.id_procedimiento=p.id AND pcs.id_centro_salud=cs.id AND pcs.activo=1 ORDER BY cs.nombre` ,
    (err, rows, fields) => {
      if (err) throw error;
      res.json(rows);
    });
};

//Procedimiento de centro de salud indicado en ID para menu centros de salud>procedimientos
controller.getProcedimientoCentroSaludById = async (req, res) => {
  const { id } = req.params;
  var sql = `SELECT c.ciglas as NIF, c.nombre AS centro_salud, p.nombre AS procedimiento, e.nombre AS especialidad
  FROM procedimientos_centro_salud pcs, centro_de_salud c, procedimientos p, especialidad e
  WHERE pcs.id_centro_salud=c.id AND pcs.id_procedimiento=p.id AND pcs.activo=1 AND p.id_especialidad=e.id AND pcs.id_procedimiento = ?`;
  mysqlConnection.query(sql, [id], (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
};
//Por procedimiento seleccionado indicar consentimientos asociados menu consentimientos > procedimientos
//Menu consentimientos >Procedimientos
controller.getByProcedimientoCentroSaludconsentimentos = async (req, res) => {
  //Me llega el id del procedimiento
  const { id } = req.params;
  console.log("mando el id"+id);
  var sql = `SELECT c.id AS id_cto,p.nombre, c.estado, ctro.nombre AS nombreCentro, esp.nombre AS nomespe,  
  DATE_FORMAT(c.fecha_creacion, '%d/%m/%Y') AS fechacreacion
  FROM procedimientos_centro_salud prc, consentimiento c, procedimientos p,especialista e, centro_de_salud ctro, especialidad esp
  WHERE prc.id=c.procedimiento
  AND prc.id_procedimiento=p.id  
  AND c.especialista=e.id
  AND e.especialidad=esp.id
  AND e.id_centro_salud=ctro.id
  AND prc.id=?`
;
  mysqlConnection.query(sql, [id], (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
};

//RUTA DE USUARIOS 

//Login de usuario
controller.login= async (req, res) => {
    const body=req.body;
    const email=body.email;   
    console.log("Estoy en login"+email);
  var sql = `SELECT id, nombre, email, password,activo
  FROM usuarios
  WHERE email=?`;
   mysqlConnection.query(sql, [email], (err, rows,fields) => {
   if (err) throw err;
   if (rows.length) {
      //visualizar el password
       const nombre=rows[0].nombre;
       const id=rows[0].id;
       const activo=rows[0].activo;
      //Comparamos contraseñas     
      bcrypt.compare(body.password,rows[0].password,(err,check)=>{         
      if (check){//las contraseñas son iguales
         //Proceso de generación de token
          var tokenData = {
          nombre:nombre,
          email: email, 
          id:id, 
          activo:activo,       
          }                
       const token = jwt.sign(
      {tokenData},secret,
      {expiresIn:'8h'});
      res.json({
        id,
      nombre,
      email,
      activo,
      mensaje: 'Autenticación correcta',
      token: token
      });                                  
   
 }else{
    //Las contraseñas no son iguales despues de desencriptar
     res.status(404).send({message:'La contraseña no es correcta'});         
 }
});          
     
   }//No se encuentra en la base de datos el email del login
   else{
      res.status(404).send({message:'El email no es correcto'});
   }
});
}
      

module.exports = controller;
