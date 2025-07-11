import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useContext } from "react";
import { sessionContext } from "../contexts/SessionContextProvider";

const backend = import.meta.env.VITE_BACKEND;
if (!backend) {
  console.error("backend url not provided");
}

interface VerdictType {
  verdict: string,
  error?: string,
  stdout: string,
  stderr: string,
  submissionId: string,
  userId: string,
  memory_mb: number,
  runtime_ms: number,
  testsPassed: number,
  totalTests: number,
}

function VerdictCard({ message }: { message: string }) {
  const [mount, setMount] = useState<boolean>(false);
  useEffect(() => {
    setMount(true);
  }, []);
  const colors: Record<string, string> = {
    "Wrong Answer": "bg-red-400", // WRONG ANSWER
    "Compilation Error": "bg-amber-400", // ERROR
    "Runtime Error": "bg-amber-400", // ERROR
    "Accepted": "bg-green-400", // ACCEPTED
  }

  return (
    <div className={`relative w-full ${mount? "" : "bg-neutral-50"} transition delay-100`}>
      <div className={`border absolute bottom-4 -right-2 h-4/5 w-full -z-10 bg-neutral-900
        shadow shadow-neutral-400 ${mount ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
            transition delay-200`}> </div>
      <h1 className={`${colors[message]} border w-full text-center py-9 text-white border-neutral-900 
      ${mount ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"} transition delay-300`}> {message.toUpperCase()}</h1>
    </div>
  )

}
export function PageLeftSubmit({
  setContent,
  submissionId,
  verdict,
  setVerdict,
  done,
  setDone,
  setErrMsg,
}: {
  setErrMsg: Dispatch<SetStateAction<{
    color: string,
    message: string,
  }>>
  done: boolean
  setDone: Dispatch<SetStateAction<boolean>>
  submissionId: string,
  verdict: VerdictType | null,
  setVerdict: Dispatch<SetStateAction<VerdictType | null>>,
  setContent: Dispatch<SetStateAction<number>>,
}) {
  const { sessionToken } = useContext(sessionContext)

  useEffect(() => {
    const interval = setInterval(async () => {
      if (done) return;
      try {
        const get = await fetch(`${backend}/api/user/submissions/${submissionId}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${sessionToken}`,
          },
        });
        const getJSON = await get.json();
        console.log(getJSON);
        if (getJSON.submission.status == "processed") {
          const verdictId = getJSON.submission.verdictId;

          try {
            const get = await fetch(`${backend}/api/user/submissions/verdict/${verdictId}`, {
              method: "GET",
              headers: {
                authorization: `Bearer ${sessionToken}`,
              }
            });
            const getJSON = await get.json();
            console.log(getJSON.verdict);

            setVerdict(getJSON.verdict);
            console.log(getJSON.verdict);
            setErrMsg({
              color: "",
              message: "",
            })
            setDone(true);
            clearInterval(interval);
          } catch (err) {
            console.error("cannot get verdict");
            clearInterval(interval);
            setDone(true);
          }
          clearInterval(interval);
          setDone(true);
        }
      } catch (err) {
        console.error("unbale to fetch result");
        return;
      }
    }, 2000);


    return () => clearInterval(interval);
  }, [done])


  {/* COMPONENT */ }
  return (
    <div className="h-full w-full flex flex-col items-center ">
      <button onClick={() => setContent(0)}
        className="cursor-pointer hover:bg-neutral-200 p-2 rounded-xl hover:-translate-x-2 transition delay-75 
        flex justify-between gap-1 items-center min-w-0 h-8 m-2">
        <p className="align-middle"> Back to problem </p>
        <img src="/left-arrow.png" className="shrink-0 object-contain p-1 h-8 w-8" /> 
      </button>

      <div className="flex flex-col items-center prose w-full text-sm">
        {verdict && (
          <>
            <h1> Verdict </h1>
            <div className="flex flex-col mx-1 p-1 w-full">
              <VerdictCard message={verdict.verdict} />
              <h4> STDOUT: </h4>
              <p className="text-sm m-0 overflow-auto w-full h-5 border border-neutral-300 p-2 rounded-xs"> {verdict.stdout} </p>
              <h4> STDERR: </h4>
              <p className="text-sm m-0 text-red-600 font-mono overflow-auto w-full h-30 border border-neutral-300 p-2 rounded-xs"> {verdict.stderr} </p>
              <h4> TESTS PASSED: </h4>
              <p className="text-sm m-0 overflow-auto w-full h-10"> {verdict.testsPassed} / {verdict.totalTests} </p>
            </div>
          </>
        )
        }
        {verdict?.error && (
          <div className="flex flex-col mx-1 p-1 w-full">
            <h4> error: </h4>
            <p className="text-sm m-0 overflow-auto w-full h-10"> {verdict.error} </p>
          </div>
        )
        }
      </div>
    </div>
  )

}
