"use client"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { useTheme } from "next-themes"

export default function Page() {
  const { setTheme } = useTheme()

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Input />
        <Button onClick={() => setTheme("light")}>Light Mode</Button>
        <Button onClick={() => setTheme("dark")}>Dark Mode</Button>
      </div>
    </div>
  )
}
