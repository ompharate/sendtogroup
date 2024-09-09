import Image from "next/image";
import MessageSection from "./MessageSection"
import FileSection from "./FileSection";
import CodeEditorSection from "./CodeEditorSection";
const tabs = [{
    id:0,
    icon: <Image alt='text' src={"/textcon.png"} width={35} height={35} />,
    component: <MessageSection />
}, {
    id:1,
    icon: <Image alt='text' src={"/filetransfer.png"} width={35} height={35} />,
    component: <FileSection />
}, {
    id:2,
    icon: <Image alt='text' src={"/codecoll.jfif"} width={35} height={35} />,
    component: <CodeEditorSection />
}]

export default tabs;