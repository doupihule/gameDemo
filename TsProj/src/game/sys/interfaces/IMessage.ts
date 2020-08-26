export default interface IMessage {
	//接收消息
	recvMsg(cmd: string, data: any): void;
}
