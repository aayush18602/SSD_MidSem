import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetQuestions, setQuestions, updateQuestion } from "../reducers/questions";
import { demoData } from "../data";
import Card from "../components/Card";
import Header from "../components/Header";
import socket from "../socket";

function Column({ title, items = [] }) {
  return (
    <div className="min-w-0 bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 flex flex-col border border-white/30 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          {items.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide">
        {items.map((it) => (
          <Card key={it._id} item={it} />
        ))}
      </div>
    </div>
  );
}

function SingleViewContainer({ title, items = [] }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [title, items.length]);

  return (
    <div className="h-full bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/30 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {items.length} questions
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 scrollbar-hide"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
          {items.map((item) => (
            <Card key={item._id} item={item} isGridView={true} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Doubts() {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.questions.questions);
  const user = useSelector((state) => state.user);

  // extract lectureId from URL url/doubts/:lectureId
  // const lectureId = window.location.pathname.split("/").pop();
  const lectureId = useSelector((state) => state.questions.lecture_id);

  const [activeView, setActiveView] = useState("kanban");

  // Load demo data into Redux store on component mount
  useEffect(()=> {
    // dispatch(setQuestions(demoData));
    // dispatch(resetQuestions()); // clear previous questions
    socket.emit("joinLecture", lectureId);

    socket.on("getLectureQuestions", (data) => {
      // change the data format to match the redux store
      data.questions = data.questions.map((q) => ({
        _id: q._id,
        question: q.content,
        authorName: q.authorName,
        authorId: q.authorId,
        status: q.status,
        createdOn: q.createdAt ? q.createdAt : new Date().toISOString(),
        answeredOn: q.answeredAt ? q.answeredAt : new Date().toISOString(),
      }));


      dispatch(setQuestions(data.questions));
    });
    
    socket.on("getUpdatedQuestion", (data) => {
      console.log("Received updated question:", data);
      const updatedQ = {
        _id: data._id,
        question: data.content,
        authorName: data.authorName,
        authorId: data.authorId,
        status: data.status,
        createdOn: data.createdAt ? data.createdAt : new Date().toISOString(),
        answeredOn: data.answeredAt ? data.answeredAt : new Date().toISOString(),
      };
      dispatch(updateQuestion(updatedQ));
    })
  }, [dispatch]);

  // Filter data based on status
  const getFilteredData = (filterType) => {
    switch (filterType) {
      case "unanswered":
        return questions.filter((item) => item.status === "unanswered");
      case "answered":
        return questions.filter((item) => item.status === "answered");
      case "important":
        return questions.filter((item) => item.status === "important");
      case "notimportant":
        return questions.filter((item) => item.status !== "important");
      case "userasked":
        return questions.filter((item) => item.authorId === user.id);
      default:
        return questions;
    }
  };

  const renderContent = () => {
    if (user.role === "student") {
      return (
        <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <Column title="Your Doubts" items={getFilteredData("userasked")} />
          <Column title="All" items={getFilteredData("notimportant")} />
          <Column title="Important" items={getFilteredData("important")} />
        </div>
      );
    }

    switch (activeView) {
      case "kanban":
        return (
          <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-6">
            <Column title="Unanswered" items={getFilteredData("unanswered")} />
            <Column title="Answered" items={getFilteredData("answered")} />
            <Column title="Important" items={getFilteredData("important")} />
          </div>
        );
      case "unanswered":
        return (
          <SingleViewContainer
            title="Unanswered Questions"
            items={getFilteredData("unanswered")}
          />
        );
      case "answered":
        return (
          <SingleViewContainer
            title="Answered Questions"
            items={getFilteredData("answered")}
          />
        );
      case "important":
        return (
          <SingleViewContainer
            title="Important Questions"
            items={getFilteredData("important")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 overflow-hidden">
      <Header activeView={activeView} onViewChange={setActiveView} />
      <main className="h-[90vh] p-6 overflow-hidden">{renderContent()}</main>
    </div>
  );
}
