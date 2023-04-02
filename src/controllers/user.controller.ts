import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";

export default class UserController {

    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    // @desc      Delete user
    // @route     GET /api/v1/user/delete
    // @access    Private
    public deleteUserHandler = async (req: any, res: Response, next: NextFunction) => {
        try {
            await this.userService.delete(req.params.id)
            return res.status(200).json({
                success: true,
                data: {}
            });
        } catch (e) {
            next(e);
        }
    }

    // @desc      Get users by role
    // @route     GET /api/v1/user/find-all-by-role
    // @access    Private
    public findAllByRoleHandler = async (req: any, res: Response, next: NextFunction) => {
        try {
            const data = await this.userService.findAllByRole(req.params.role);
            return res.status(200).json({
                success: true,
                message: "Users successfully fetched by role " + req.params.role,
                length: data[1],
                data: data[0],
            });
        } catch (e) {
            next(e);
        }
    }

    // @desc     Update user profile photo
    // @route     PUT /api/v1/user/photo
    // @access    Private
    public setPhotoHandler = async (req: any, res: Response, next: NextFunction) => {
        try {
            await this.userService.setPhoto(req.user.id, req.body);
            return res.status(200).json({
                success: true,
                message: 'Photo updated successfully',
                data: {}
            });
        } catch (e) {
            next(e);
        }
    }
}

