"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const initialState = { message: "" };

export default function LoginPage() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <Card className="w-full max-w-sm bg-slate-900 border-amber-900/20 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-playfair text-amber-400">Admin Access</CardTitle>
          <p className="text-center text-slate-400 text-sm">Enter your credentials to continue</p>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="bg-slate-800 border-slate-700 text-slate-100 focus:border-amber-500/50 focus:ring-amber-500/20"
              />
            </div>
            {state?.message && (
              <p className="text-sm text-red-400 text-center bg-red-950/20 p-2 rounded border border-red-900/30">{state.message}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-medium" type="submit">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
