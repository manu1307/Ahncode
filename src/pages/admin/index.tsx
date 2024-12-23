import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { firestore } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import Topbar from "@/components/Topbar/Topbar";
import Input from "@/components/Inputs/Input";
import MarkdownEditor from "@uiw/react-markdown-editor";
import TextInput from "@/components/Inputs/TextInput";

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name?: string
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
    const problemsData = {
      category: inputs.category,
      difficulty: inputs.difficulty,
      dislikes: 0,
      id: inputs.id,
      likes: 0,
      order: Number(inputs.order),
      title: inputs.title,
    };
    const problems_set_Data = {
      id: inputs.id,
      title: inputs.title,
      problemStatement: inputs.problemStatement,
      examples: inputs.examples,
      constraints: inputs.constraints,
      starterCode: inputs.starterCode,
      handlerFunction: inputs.handlerFunction,
      order: Number(inputs.order),
      starterFunctionName: inputs.starterFunctionName,
    };
    await setDoc(doc(firestore, "problems", inputs.id), problemsData);
    await setDoc(doc(firestore, "problems_set", inputs.id), problems_set_Data);
    alert("saved to db");
    router.push("/");
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
    <div className="bg-gradient-to-b from-gray-600 to-black h-screen relative overflow-scroll">
      <Topbar />
      <div className="max-w-7xl mx-auto">
        <form
          className="p-6 flex flex-col max-w-lg gap-3 mx-auto"
          onSubmit={handleSubmit}
        >
          <div>
            <Input
              label="Problem ID:"
              type="text"
              name="id"
              value={inputs.id}
              onChange={handleInputChange}
              // onChange={(e) => handleInputChange(e, "id")}
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
              // onChange={(e) => handleInputChange(e, "text")}
              required
            />
          </div>
          <div>
            <Input
              label="Category:"
              type="text"
              name="category"
              value={inputs.category}
              onChange={handleInputChange}
              // onChange={(e) => handleInputChange(e, "text")}
              required
            />
          </div>
          <div>
            <Input
              label="Difficulty:"
              type="text"
              name="difficulty"
              value={inputs.difficulty}
              onChange={handleInputChange}
              // onChange={(e) => handleInputChange(e, "text")}
              required
            />
          </div>
          <div>
            <TextInput
              label="Problem Statement:"
              name="problemStatement"
              value={inputs.problemStatement}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            {/* <label>Constraints:</label> */}
            {/* <MarkdownEditor onChange={(value) => handleInputChange(value, "id")} /> */}
            <TextInput
              label="Constraints:"
              name="constraints"
              value={inputs.constraints}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <TextInput
              label="Starter Code:"
              name="starterCode"
              value={inputs.starterCode}
              onChange={handleInputChange}
            />
          </div>
          <div>
            {/* <label>Handler Function:</label> */}
            <TextInput
              label="Handler Function:"
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
            <h3 className="text-white font-lg font-semibold">Examples:</h3>
            {inputs.examples.map((example, index) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <label className="text-white font-lg font-semibold">
                  Example {index + 1}:
                </label>
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
                <TextInput
                  placeholder="Explanation"
                  value={example.explanation}
                  onChange={(e) =>
                    handleExampleChange(index, "explanation", e.target.value)
                  }
                />
                <div className="flex gap-4">
                  <button
                    className="bg-red-100 w-full rounded-lg p-2 mt-3 hover:bg-red-200"
                    type="button"
                    onClick={() => handleRemoveExample(index)}
                  >
                    Remove Example
                  </button>
                  <button
                    className="bg-blue-100 w-full rounded-lg p-2 mt-3 hover:bg-blue-200"
                    type="button"
                    onClick={handleAddExample}
                  >
                    Add Example
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="px-2 py-4 rounded-lg text-xl font-semibold bg-brand-orange">
            save to db
          </button>
        </form>
      </div>
    </div>
  );
};
export default AdminPage;
