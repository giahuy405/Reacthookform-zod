import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
const DAYS = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
];
function App() {
  const { register, getValues } = useForm();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(getValues());
  };
  return (
    <>
      <div className="min-h-screen w-screen flex justify-center pt-8 bg-slate-800">
        <Card className="w-[500px] h-[500px]">
          <CardHeader>Contact form</CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="Email" size="sm" {...register("email")} />
              <Input label="Name" size="sm" {...register("name")} />
              <Input label="Password" size="sm" {...register("password")} />
              <Select label="Days" {...register('days')}>
                {DAYS.map((item) => (
                  <SelectItem value={item.value} key={item.label}>
                    {item.label}
                  </SelectItem>
                ))}
              </Select>

              <Button type="submit">Submit</Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default App;
