"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { UserRolesInterface } from "~/server/db/type";
import { role } from "~/server/db/type"

const formSchema = z.object({
  role: z.string(role)
});



export default function RoleForm() {
  const [data, setData] = useState({ loading: true, content: null })

  const handleRoleSubmit = async () => {
    const params: UserRolesInterface = {
      userId: ,
      userRole: "doctor/patient"
    };
  
    try {
      const response = await fetch('/api/db/management/user-role/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
  
      const result = await response.json();
      setData({ loading: false, content: result });
    } catch (error) {
      console.error('Error:', error);
      setData({ loading: false, content: null });
    }
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRoleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-1">
                    <FormControl>
                      <RadioGroupItem value="doctor" />
                    </FormControl>
                    <FormLabel className="font-normal">Doctor</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-1">
                    <FormControl>
                      <RadioGroupItem value="patient" />
                    </FormControl>
                    <FormLabel className="font-normal">Patient</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        ></FormField>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
