import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { shuffle } from "lodash";
import _shuffle from 'lodash/shuffle';

import { FormatQuestion } from "./types/data.types";
const CATEGORIES = [
  {
    label: "Sports",
    value: "21", // string not number
  },
  {
    label: "History",
    value: "23",
  },
  {
    label: "Politics",
    value: "24",
  },
];
const DIFFICULTIES = [
  {
    label: "Easy",
    value: "easy",
  },
  {
    label: "Medium",
    value: "medium",
  },
  {
    label: "Hard",
    value: "hard",
  },
];
const DEFAULT_CATREGORY = CATEGORIES[0].value;
const DEFAULT_DIFFICULTIES = DIFFICULTIES[0].value;

function App() {
  const [score, setScore] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [currentIndex, setCurrrentIndex] = useState(0);
  const [config, setConfig] = useState<"configMode" | "questionMode">(
    "configMode"
  );
  const [question, setQuestion] = useState<FormatQuestion[]>([]);

  const currentQuestion = question[currentIndex];

  const { register, getValues } = useForm({
    defaultValues: {
      amount: "10",
      categories: DEFAULT_CATREGORY,
      difficulties: DEFAULT_DIFFICULTIES,
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let { amount, difficulties, categories } = getValues();
    fetchQuestion({ amount, difficulties, categories });
  };

  const fetchQuestion = async ({
    amount,
    difficulties,
    categories,
  }: {
    amount: string;
    difficulties: string;
    categories: string;
  }) => {
    setLoading(true);
    const res = await axios.get(
      `https://opentdb.com/api.php`,{
        params: {
          amount,
          difficulty: difficulties, 
          category: categories,
        },
      }
    );
    const formatQuestion = res?.data?.results.map((item: any) => ({
      ...item,
      questionTotal: _shuffle([...item.incorrect_answers, item.correct_answer]),
    }));
    console.log(formatQuestion);
    setQuestion(formatQuestion || []);

    setLoading(false);
    setConfig("questionMode");
  };

  const handleNextQuestion = () => {
    setCurrrentIndex(currentIndex + 1);
    setClassIndex(null)
  };

  const [anwserQuestion, setAnwserQuestion] = useState("");
  const [indexClass, setClassIndex] = useState<null | number | undefined>();

  const handleAnswer = () => {
    if (currentQuestion?.correct_answer === anwserQuestion) {
      setScore((prev) => prev + 10);
      toast.success("Correct!", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "light",
      });
      toast.success(`+ 10 points`, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "light",
      });
    } else {
      toast.error("Incorrect!", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "light",
      });
    }
    setCurrrentIndex((prev) => prev + 1);
    setClassIndex(null);
  };
  
  useEffect(()=>{
    if(!question[currentIndex]?.question){
      setConfig('configMode')
      setCurrrentIndex(0)
    }
  },[question[currentIndex]])



  return (
    <>
      <div className="min-h-screen w-screen flex justify-center pt-8 bg-slate-800">
        {/* <pre>{JSON.stringify(question)}</pre> */}

        {config === "configMode" && (
          <Card className="w-[500px] h-full py-5">
            <>
              {!isLoading && (
                <>
                  <CardHeader>Contact form</CardHeader>
                  <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <Input
                        label="Amount of question"
                        size="sm"
                        defaultValue="10"
                        {...register("amount")}
                      />
                      <Select
                        label="Category"
                        {...register("categories")}
                        defaultSelectedKeys={[DEFAULT_CATREGORY]}
                        size="sm"
                      >
                        {CATEGORIES.map((item) => (
                          <SelectItem value={item.value} key={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                        size="sm"
                        label="Difficulties"
                        {...register("difficulties")}
                        defaultSelectedKeys={[DEFAULT_DIFFICULTIES]}
                      >
                        {DIFFICULTIES.map((item) => (
                          <SelectItem value={item.value} key={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </Select>
                      <Button type="submit">Submit</Button>
                    </form>
                  </CardBody>
                </>
              )}
              {isLoading && (
                <div className="flex items-center justify-center w-full h-full">
                  <Spinner label="Loading..." color="warning" />
                </div>
              )}
            </>
          </Card>
        )}
        {config === "questionMode" && (
          <div>
            <div className="bg-orange-500 p-3 shadow-sm rounded-lg">
              {question[currentIndex]?.question}
            </div>

            <div className="space-y-3 mt-6">
              {currentQuestion?.questionTotal?.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setAnwserQuestion(item);
                    setClassIndex(+index);
                  }}
                  className={` p-3 shadow-sm rounded-lg hover:bg-orange-300 cursor-pointer ${
                    +index === indexClass ? "bg-orange-300" : "bg-white"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-3 mt-7">
              <Button onClick={handleNextQuestion} className="block  ">
                Next question
              </Button>
              <Button onClick={handleAnswer} className="block" color="primary">
                Submit
              </Button>
            </div>
          </div>
        )}

        
        <ToastContainer />
        <div className="fixed top-10 right-16  py-2 px-5 rounded-md bg-green-300">
          Your score : {score}
        </div>
      </div>
    </>
  );
}

export default App;
