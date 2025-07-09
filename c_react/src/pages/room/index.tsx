import { useParams, useNavigate, useSearchParams } from "react-router"
import { useEffect,use } from "react";
import { decode } from "@/libs/handle";
import { useEmployeeStore } from "@/stores/employee";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import { AppContext } from "@/contexts/app";
import { useSocket } from "@/hooks/socket";
const Room = () => {
  const params = useParams()
  const navigate = useNavigate()
  const socketRef = useSocket();
  const { channel,setOnMeeting,setIsMeeting } = use(AppContext)
  const {employee} = useEmployeeStore()
  const [searchParams] = useSearchParams()
  const list = searchParams.get("list")
  const id = params.id?.split("&")[0]
  let count = 0
  useEffect(() => {
    if(list){
      const parseData = decode(list,import.meta.env.VITE_SK)
      const includeEmployee = employee && parseData.includes(employee.employee_id)
      !includeEmployee && navigate("/")
    }
  },[list,channel,id])
  const myMeeting = async(element: any) => {
    const { ZegoUIKitPrebuilt } = await import(
      "@zegocloud/zego-uikit-prebuilt"
    );
    const appID = parseInt(import.meta.env.VITE_ZEGO_APP_ID!);
    const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET!;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      id!,
      uuid(),
      employee ? `${employee.first_name} ${employee.last_name}` : "anonymous",
      720,
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      maxUsers: 50,
      showTextChat: false,
      layout: "Grid",
      showScreenSharingButton: false,
      showPreJoinView: true,
      lowerLeftNotification: {
        showUserJoinAndLeave: true,
      },
      onReturnToHomeScreenClicked: () => {
        if (count === 0) {
          list && socketRef.current?.emit("off_meeting", { channel: channel[0]._id })
          !list && socketRef.current?.emit("remove_public_meeting", { id: id })
          setIsMeeting(null)
        }
        setOnMeeting(false)
        navigate("/");
      },
      onUserJoin(users) {
        toast.success(`${users[0].userName} has joined the room`);
        count += 1
      },
      
      onUserLeave(users) {
        count -= 1
        toast.error(`${users[0].userName} has left the room`);
      },
    });
  }
  const myRef = (element: any) => {
    myMeeting(element);
  };
  return (
    <div
      className="myCallContainer"
      ref={myRef}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  )
}
export default Room
