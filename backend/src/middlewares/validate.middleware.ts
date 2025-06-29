import { Request, Response, NextFunction } from "express"
import { AnyZodObject, ZodError } from "zod"
import ApiError from "@/utils/api.Error"


export const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params
        })
        next()
    } catch (error) {
        if(error instanceof ZodError){
            const errorMessage = error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message
            }))
            return next(new ApiError(400, "Validation Error", errorMessage))
        }
        return next(new ApiError(500, "Internal Server Error"))
    }
}