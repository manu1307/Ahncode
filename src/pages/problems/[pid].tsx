import Topbar from "@/components/Topbar/Topbar";
import Workspace from "@/components/Workspace/Workspace";
import { firestore } from "@/firebase/firebase";
import useHasMounted from "@/hooks/useHasMounted";
// import { problems } from "@/utils/problems";
import { Problem } from "@/utils/types/problem";
import { doc, getDoc } from "firebase/firestore";
import React from "react";

type ProblemPageProps = {
  problem: Problem;
};

const ProblemPage: React.FC<ProblemPageProps> = ({ problem }) => {
  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  return (
    <div>
      <Topbar problemPage />
      <Workspace problem={problem} />
    </div>
  );
};
export default ProblemPage;

// fetch the local data
//  SSG
export async function getStaticPaths() {
  // const paths = Object.keys(problems).map((key) => ({
  //   params: { pid: key },
  // }));

  // 가능한 문제 경로들
  // const paths = [
  //   {
  //     params: {
  //       pid: "two-sum",
  //     },
  //   },
  //   {
  //     params: {
  //       pid: "reverse-linked-list",
  //     },
  //   },
  //   {
  //     params: {
  //       pid: "jump-game",
  //     },
  //   },
  //   {
  //     params: {
  //       pid: "search-a-2d-matrix",
  //     },
  //   },
  //   {
  //     params: {
  //       pid: "valid-parentheses",
  //     },
  //   },
  // ];

  return {
    paths: [], // 정적으로 미리 생성된 경로 없음
    fallback: true, // 모든 경로를 동적으로 처리
  };
}

export async function getStaticProps({ params }: { params: { pid: string } }) {
  const { pid } = params;
  // const problem = problems[pid];
  const docRef = doc(firestore, "problems_set", pid);
  const docSnap = await getDoc(docRef);
  const problem = docSnap.data();

  if (!problem) {
    return {
      notFound: true,
    };
  }
  problem.handlerFunction = problem.handlerFunction.toString();
  return {
    props: {
      problem,
    },
  };
}
