"use client";

import React from "react";
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

const formSchema = z.object({
  role: z.enum(["doctor", "patient"], {
    required_error: "You must select a role",
  }),
});

function setRole(values: z.infer<typeof formSchema>) {
  console.log(values);
}

export default function RoleForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(setRole)} className="space-y-8">
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
