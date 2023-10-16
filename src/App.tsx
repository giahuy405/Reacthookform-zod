import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";

function App() {
  const { register } = useForm();
  return (
    <>
      <div className="min-h-screen w-screen flex justify-center pt-8 bg-slate-800">
        <Card className="w-[500px] h-[500px]">
          <CardHeader>Contact form</CardHeader>
          <CardBody>
            <form>
              <Input label="Email" size="sm" />
              <Button type="submit">Submit</Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default App;
