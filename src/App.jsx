import React, { useState, useEffect } from "react";
import { emails as datas } from "./emails";

function ResultComponent({ results, handle_click }) {
  return (
    <div className="self-start flex flex-col overflow-auto max-h-[270px] EMAIL_BOX_SHADOW bg-[#FDFDFD] rounded-md py-6">
      {results.map((result, index) => (
        <span
          key={index}
          className="p-4 px-6 hover:bg-[#eff5f9]"
          onClick={() => {
            handle_click(result);
          }}
        >
          {result}
        </span>
      ))}
    </div>
  );
}

function EmailComponent({ emails }) {
  const [email, setEmails] = useState([]);
  const [is_loading, set_is_loading] = useState(false);
  const [input_value, set_input_value] = useState("");

  const [show_delete, set_show_delete] = useState("");

  const [results, set_results] = useState([]);

  // Click from the results
  const handle_click = (clicked_value) => {
    if (email.includes(clicked_value)) {
      return;
    }

    setEmails((prev) => [...prev, clicked_value.trim()]);
    set_results([]);
    set_input_value("");
  };

  const handle_delete = (e) => {
    setEmails(email.filter((em) => em !== show_delete));
  };

  const handle_submit = (e) => {
    // Enter, Tab = e.code
    if (e.code === "Enter" || e.code === "Tab") {
      e.preventDefault();

      if (email.includes(e.target.value)) {
        return;
      }

      setEmails((prev) => [...prev, e.target.value]);
      set_input_value("");
    }
  };

  // Loading Effect
  useEffect(() => {
    if (input_value.length === 0) {
      set_results([]);
      set_is_loading(false);
      return;
    }

    set_is_loading(true);

    const timeout = setTimeout(() => {
      set_is_loading(false);
      set_results(emails.filter((em) => em.startsWith(input_value)));
    }, 700);

    return () => {
      clearTimeout(timeout);
    };
  }, [input_value]);

  return (
    <>
      <div className="relative EMAIL_BOX_SHADOW bg-[#FDFDFD] rounded-md w-[420px] min-h-[50px] flex justify-center items-center">
        <div className="relative flex-1 p-3 flex flex-wrap items-center gap-y-3 overflow-hidden">
          {/* Emails */}
          {email.map((em, index) => {
            return (
              <React.Fragment key={index}>
                {em.match(/^.+@.+\..+$/) ? (
                  <span
                    className="mr-2 font-bold overflow-hidden flex items-center p-2 gap-1 h-6 rounded-sm hover:bg-gray-200 cursor-default"
                    data-key={em}
                    onMouseEnter={(e) => set_show_delete(e.target.dataset.key)}
                    onMouseLeave={() => set_show_delete("")}
                  >
                    {em}

                    <span
                      className={`font-bold cursor-pointer ${
                        show_delete !== em && "invisible"
                      }`}
                      onClick={handle_delete}
                    >
                      x
                    </span>
                  </span>
                ) : (
                  <span
                    className="mr-2 font-bold bg-[#f3b7bd] flex items-center p-2 gap-2 h-6 rounded-sm overflow-hidden cursor-default"
                    data-key={em}
                    onMouseEnter={(e) => set_show_delete(e.target.dataset.key)}
                    onMouseLeave={() => set_show_delete("")}
                  >
                    {em}
                    <span
                      className="rounded-full font-bold bg-red-400 text-white p-2 h-1 w-1 flex justify-center items-center cursor-pointer"
                      onClick={handle_delete}
                    >
                      {show_delete === em ? "x" : "!"}
                    </span>
                  </span>
                )}
              </React.Fragment>
            );
          })}

          {/* Input Field Email */}
          <input
            type="text"
            placeholder={email.length === 0 ? "Enter recipients..." : ""}
            className="placeholder-[#bdbdbd] outline-none flex-1 text-[#bdbdbd]"
            value={input_value}
            onChange={(e) => set_input_value(e.target.value)}
            onKeyDown={handle_submit}
          />

          {/* Loading */}
          {is_loading && (
            <div className="absolute top-[14px] right-[10px] w-4 h-4 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
          )}
        </div>

        {/* Results of query */}
      </div>
      {results.length !== 0 && (
        <ResultComponent results={results} handle_click={handle_click} />
      )}
    </>
  );
}

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loader = async () => {
      const response = await datas;
      setData(response);
    };

    loader();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col">
        <EmailComponent emails={data} />
      </div>
    </div>
  );
}

export default App;
