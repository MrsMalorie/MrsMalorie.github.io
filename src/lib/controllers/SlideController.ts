import { TitleSlide } from "../types/TitleSlide";

const SHEET_NAME: string = "Sheet2";
const SHEET_ID: string = "1PlHTImrXIe4jogcRhLYhFEs99Z-eS8Bh-It-1y_pfBU";

const SHEET_BASE_URL: string = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/`;
const SHEET_SANITIZATION_MATCH: RegExp = /(?<=\().*(?=\);)/s;

export default class SlideController {
    private static buildSheetLink(query?: string): string {
        if (!query) {
            return `${SHEET_BASE_URL}sheet=${SHEET_NAME}`;
        }

        return `${SHEET_BASE_URL}tq?tq=${encodeURIComponent(query)}&sheet=${SHEET_NAME}`;
    }

    public static async getTitleSlide(): Promise<TitleSlide> {
        const today = new Date();
        const slideKey = `${today.getMonth() + 1}/${today.getDate()}`;

        const response = await fetch(
            SlideController.buildSheetLink(`SELECT D WHERE A CONTAINS '${slideKey}'`)
        );

        if (!response.ok) throw new Error("Failed to query the title slide.");

        const text = await response.text();
        const matched_text = text.match(SHEET_SANITIZATION_MATCH);
        if (!matched_text) throw new Error(`Missing data for key ${slideKey}.`);

        const json = JSON.parse(matched_text[0]);
        const rows = json?.table?.rows;
        if (!rows) throw new Error(`Missing data for key ${slideKey}.`);

        const data = rows[0];
        if (!data) throw new Error(`Missing data for key ${slideKey}.`);

        return {
            memeUrl: data.c[0]?.v,
        }
    }
}