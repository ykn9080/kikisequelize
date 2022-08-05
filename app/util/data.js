const db = require("../models");
const RouteDriver = db.route_driver;

exports.fixedupdate = (req, res) => {
    req.dt.map((k,i)=>{
        db.route_driver.update({fixed_start_order:k.fixed_start_order }, {
            //db.route_driver1.update({fixed_start_order:k.fixed_start_order,created_at:k.created_at }, {
            where: { id: k.id },
          });
    });
   res.send(req.dt);
        // .then((num) => {
        //   if (num == 1) {
        //     res.send({
        //       message: "Tutorial was updated successfully.",
        //     });
        //   } else {
        //     res.send({
        //       message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`,
        //     });
        //   }
        // })
        // .catch((err) => {
        //   res.status(500).send({
        //     message: "Error updating Tutorial with id=" + id,
        //   });
        // });
  }