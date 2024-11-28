import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { firestore } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import Topbar from "@/components/Topbar/Topbar";
import Input from "@/components/Inputs/Input";

interface Example {
  id: number;
  inputText: string;
  outputText: string;
  explanation: string;
}

interface ProblemFormData {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  problemStatement: string;
  examples: Example[];
  constraints: string;
  starterCode: string;
  handlerFunction: string;
  order: number;
  starterFunctionName: string;
}

const AdminPage: React.FC = () => {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [inputs, setInputs] = useState<ProblemFormData>({
    id: "",
    title: "",
    difficulty: "",
    category: "",
    order: 0,
    problemStatement: "",
    examples: [
      {
        id: 1,
        inputText: "",
        outputText: "",
        explanation: "",
      },
    ],
    constraints: "",
    starterCode: "",
    handlerFunction: "",
    starterFunctionName: "",
  });

  // const [inputs, setInputs] = useState({
  //   id: "",
  //   title: "",
  //   difficulty: "",
  //   category: "",
  //   order: 0,
  //   likes: 0,
  //   dislikes: 0,
  // });
  async function addProblem() {
    const problem = {
      id: ``,
      title: ``,
      problemStatement: ``,
      examples: [
        {
          id: 1,
          inputText: "nums = [2,7,11,15], target = 9",
          outputText: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
        },
        {
          id: 2,
          inputText: "nums = [3,2,4], target = 6",
          outputText: "[1,2]",
          explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
        },
      ],
      constraints: ``,
      starterCode: ``,
      handlerFunction: ``,
      order: 1,
      starterFunctionName: "function twoSum(",
    };

    // Firestore에 데이터 추가
    await setDoc(doc(firestore, "problems_set", problem.id), problem);

    alert("Problem added successfully!");
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleExampleChange = (
    index: number,
    field: keyof Example,
    value: string
  ) => {
    const updatedExamples = [...inputs.examples];
    updatedExamples[index][field] = value as never;
    setInputs((prev) => ({ ...prev, examples: updatedExamples }));
  };

  const handleAddExample = () => {
    setInputs((prev) => ({
      ...prev,
      examples: [
        ...prev.examples,
        {
          id: prev.examples.length + 1,
          inputText: "",
          outputText: "",
          explanation: "",
        },
      ],
    }));
  };

  const handleRemoveExample = (index: number) => {
    const updatedExamples = inputs.examples.filter((_, i) => i !== index);
    setInputs((prev) => ({ ...prev, examples: updatedExamples }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newProblem = { ...inputs, order: Number(inputs.order) };
    await setDoc(doc(firestore, "problems", inputs.id), newProblem);
    alert("saved to db");
  };

  useEffect(() => {
    const LOGIN_INFO = localStorage.getItem("LOGIN_INFO");
    if (!LOGIN_INFO) router.push("/");
    setPageLoading(false);
    // 임시 admin 계정
    if (LOGIN_INFO?.includes("admin") || LOGIN_INFO?.includes("jasonsc")) {
      router.push("/admin");
    }
  }, [router]);

  if (pageLoading) return null;

  return (
    <div className="bg-gradient-to-b from-gray-600 to-black h-screen relative">
      <Topbar />
      <div className="max-w-7xl mx-auto">
        <form
          className="p-6 flex flex-col max-w-lg gap-3 mx-auto"
          onSubmit={addProblem}
        >
          <div>
            <Input
              label="Problem ID:"
              type="text"
              name="id"
              value={inputs.id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Input
              label="Title:"
              type="text"
              name="title"
              value={inputs.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Problem Statement:</label>
            <textarea
              name="problemStatement"
              value={inputs.problemStatement}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Constraints:</label>
            <textarea
              name="constraints"
              value={inputs.constraints}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Starter Code:</label>
            <textarea
              name="starterCode"
              value={inputs.starterCode}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Handler Function:</label>
            <textarea
              name="handlerFunction"
              value={inputs.handlerFunction}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Input
              label="Order:"
              type="number"
              name="order"
              value={inputs.order}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Input
              label="Starter Function Name:"
              type="text"
              name="starterFunctionName"
              value={inputs.starterFunctionName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <h3>Examples:</h3>
            {inputs.examples.map((example, index) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <label>Example {index + 1}:</label>
                <Input
                  type="text"
                  placeholder="Input Text"
                  value={example.inputText}
                  onChange={(e) =>
                    handleExampleChange(index, "inputText", e.target.value)
                  }
                  required
                />
                <Input
                  type="text"
                  placeholder="Output Text"
                  value={example.outputText}
                  onChange={(e) =>
                    handleExampleChange(index, "outputText", e.target.value)
                  }
                  required
                />
                <textarea
                  placeholder="Explanation"
                  value={example.explanation}
                  onChange={(e) =>
                    handleExampleChange(index, "explanation", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExample(index)}
                >
                  Remove Example
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddExample}>
              Add Example
            </button>
          </div>

          <button className="bg-white">save to db</button>
        </form>
      </div>
    </div>
  );
};
export default AdminPage;
