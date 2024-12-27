import { Request, Response } from "express";
import { permissionsModel } from "../../models/PermissionModel/PermissionModel";
import { Errors } from "../../utils/Errors";
import { permissions_app, Permissions_App } from "../../models/PermissionModel/Permission-app";

class PermissionsController   {
  
/* 
  async createPermission(req: Request, res: Response) {
    const { name, description } = req.body;
    try {
      const existingPermission = await permissionsModel.findByName(name);
      if (existingPermission) {
        const error: any = { message: "Permission already exists" }
        return Errors.handleError(error, res)
      }
      const newPermission = await permissionsModel.create({ name, description });
      res.json(newPermission);
    } catch (error: any) {
     Errors.BadRequestError(error, res)
     
    }
  }
 */
  async getAllPermissions(_:any, res: Response) {
    try {
      const data = await permissionsModel.findAll();
      res.json({data});
    } catch (error: any) {
     Errors.BadRequestError(error, res)
     
    }
  }
  async getAllPermissions_App(req:Request, res: Response) {
    const {userType} = req.params
    try {
      if(userType == "Singular"){
        const data = await permissions_app.findAll_AppSingular();
        
          res.json({data});
      } else {
        const data = await permissions_app.findAll_AppEmpresa();
        
          res.json({data});
      }
     
    } catch (error: any) {
     Errors.BadRequestError(error, res)
     
    }
  }
  async DeleteIdPermissions(req: Request, res: Response) {
    try {
      const data = await permissionsModel.Delete(Number(req.params.id));
      res.json({data, message: "Permissao deletada"});
    } catch (error: any) {
     Errors.BadRequestError(error, res)
     
    }
  }

  
}

export const permissionsController = new PermissionsController();
