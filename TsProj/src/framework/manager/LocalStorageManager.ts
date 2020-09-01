import UserInfo from "../common/UserInfo";
import FileUtils from "../utils/FileUtils";
import GameConsts from "../../game/sys/consts/GameConsts";
import TableUtils from "../utils/TableUtils";
import LogsManager from "./LogsManager";

export enum StorageKey {
	HIGHEST_SCORE = "HIGHEST_SCORE",
	HIGHEST_GOAL = "HIGHEST_GOAL",
	HIGHEST_COIN = "HIGHEST_COIN",
}

export default class LocalStorageManager {
	public static setItem(key: string, value: string): void {

	}

	public static getItem(key: string): string {
		return null
	}

	public static removeItem(key: string): void {
	}

	public static clearStorage(): void {
	}

}