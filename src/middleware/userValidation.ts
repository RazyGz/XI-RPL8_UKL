import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const createSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid("ADMIN", "USER").required()
    
});

const createValidation = (req: Request, res: Response, next: NextFunction): void => {
    const validate = createSchema.validate(req.body, { abortEarly: false }); // To get all errors
    if (validate.error) {
        res.status(400).json({
            message: validate.error.details.map(it => it.message).join(", "), // Error messages separated by comma
        });
        return
    }
    next();
}

// update a rule/schema for adding new medicine
const updateSchema = Joi.object({
    username: Joi.string().optional(),
    email: Joi.string().optional(),
    password: Joi.string().optional(),
    role: Joi.string().valid("ADMIN", "USER").optional()
});

const updateValidation = (req: Request, res: Response, next: NextFunction): void => {
    const validate = updateSchema.validate(req.body, { abortEarly: false }); // To get all errors
    if (validate.error) {
        res.status(400).json({
            message: validate.error.details.map(it => it.message).join(", "), // Error messages separated by comma
        });
        return
    }
    next();
};

const authSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(0).required(),
    role: Joi.string().valid("ADMIN", "USER").required()
})

const authValidation = (req: Request, res: Response, next: NextFunction): void => {
    const validate = authSchema.validate(req.body, { abortEarly: false }); // To get all errors
    if (validate.error) {
        res.status(400).json({
            message: validate.error.details.map(it => it.message).join(", ")
        })
    }
    next();
}

export { authValidation, createValidation, updateValidation };