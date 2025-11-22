import {
	processCurrentlyPlayingResponse,
	isAuthenticated,
	processTrack,
} from "api";
import {
	App,
	ButtonComponent,
	Modal,
	Setting,
	TextComponent,
	Notice,
	SearchComponent,
} from "obsidian";
import { createSongFile } from "SpotifyLogger";
import { SpotifySearchModal } from "SpotifySearchModal";
import { PlaybackState, Song, Track, TrackFormatted } from "types";

export class SpotifyLogModal extends Modal {
	readonly onChooseSuggestionCb = async (track: TrackFormatted) => {
		console.log("searching from log modal");
		const songFile = await createSongFile(this.app, this.folderPath, track);
	};

	constructor(
		public app: App,
		readonly currentlyPlaying: PlaybackState,
		readonly folderPath: string,
		readonly onSubmit: (result: string) => void,
	) {
		super(app);

		const track = processCurrentlyPlayingResponse(this.currentlyPlaying);
		if (!track) {
			console.log("is episode"); //TODO: Handle episode
			return;
		}

		const title = `${track.artists} - ${track.name}`;
		this.setTitle(title);

		let input = "";

		this.contentEl.addClass("spotify-log-modal-content-container");

		const textComponent = new TextComponent(this.contentEl);

		textComponent.inputEl.addClass("spotify-log-modal-input");
		textComponent.inputEl.addEventListener("keydown", (event) => {
			if (!event.isComposing && event.key === "Enter") {
				event.preventDefault();
				this.onSubmit(input);
				this.close();
			}
		});

		textComponent.onChange((value) => {
			input = value;
		});

		this.contentEl.createEl("div", {
			text: track.progress,
			cls: "spotify-log-modal-progress",
		});

		const buttonContainer = this.contentEl.createDiv(
			"spotify-log-modal-button-container",
		);

		const searchButton = new ButtonComponent(buttonContainer)
			.setButtonText("Search song")
			.onClick(() => {
				if (!isAuthenticated()) {
					new Notice("Please connect your Spotify account", 3000);
					return;
				}
				new SpotifySearchModal(
					this.app,
					this.onChooseSuggestionCb,
				).open();
			});

		const saveButton = new ButtonComponent(buttonContainer)
			.setButtonText("Save")
			.setCta()
			.onClick(() => {
				this.onSubmit(input);
				this.close();
			});
	}
}
