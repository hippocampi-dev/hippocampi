import { NextApiRequest, NextApiResponse } from 'next'
import { createAvailability } from '~/app/_actions/schedule/actions'
import { DoctorAvailabilitiesInterface } from '~/server/db/type';

export const POST = async(request:Request) => {
    try {
        const body = await request.json();
        const formData = new FormData()
        formData.append("day", body.day)
        formData.append("start-time", body["start-time"])
        formData.append("end-time", body["end-time"])
        
        const result = await createAvailability(formData)
        
        // If there are errors in the result, return a 400 status
        if (result.errors || result.error) {
            return Response.json(result, { status: 400 });
        }
        
        return Response.json(result);
    } catch (error) {
        return Response.json({
            error: error instanceof Error ? error.message : "Failed to create availability",
            message: "Failed to create availability"
        }, { status: 500 });
    }
}