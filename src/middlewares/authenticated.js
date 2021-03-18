const jwt = require('jsonwebtoken');
var secret='clave_secreta_curso_desarrollar_red_social_angular';

//req:datos que recibimos en peticion,res:respuesta que devolvemos,next:funcionalidad para saltar a otra cosa
exports.ensureAuth=function(req,res,next){
    //Verificamos si hay token en la cabecera en el campo Authorization
    if(!req.headers.authorization){
        return res.status(403).send({message:'La petición no tiene la cabecera de autenticación'});        
    }
    //Si me llega el token con replace quitamos comillas simples y dobles y las sustituimos por nada
    var token=req.headers.authorization.replace(/['"]+/g,'');
    
   // validamos el token mediante el método verify, el cual validará que el token sea válido
     // y además que no esté caducado, en cualquiera de estos dos casos, 
     // un error 401 es retornado junto con el mensaje de error. 
     
jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).send({
          error: 'Token inválido'
        })
      } else {
          //Finalmente, si todo sale bien procederemos a ejecutar el metodo solicitado por el usuario
           req.decoded=decoded;
           next();
       // })
      }
    })
}