export interface obsidianfmDefaultSettings {
	folderPath: string;
	logAlbumAlwaysCreateNewTrackFiles: boolean;
	showType: boolean;
	showDuration: boolean;
	showTags: boolean;
	showAlbumReleaseDate: boolean;
}

export const OBSIDIANFM_DEFAULT_SETTINGS: obsidianfmDefaultSettings = {
	folderPath: "",
	logAlbumAlwaysCreateNewTrackFiles: false,
	showType: true,
	showDuration: true,
	showAlbumReleaseDate: true,
	showTags: true,
};
