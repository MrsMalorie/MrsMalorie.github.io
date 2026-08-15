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

        const [dailyResponse, staticResponse] = await Promise.all([
            fetch(
                SlideController.buildSheetLink(`SELECT B, D, C WHERE A CONTAINS '${slideKey}'`)
            ),
            fetch(
                SlideController.buildSheetLink(`SELECT F, G WHERE A CONTAINS '1/1'`)
            )
        ]);

        if (!dailyResponse.ok) throw new Error("Failed to query the title slide.");
        if (!staticResponse.ok) throw new Error("Failed to query the title slide.");

        const [dailyText, staticText] = await Promise.all([dailyResponse.text(), staticResponse.text()]);

        const dailyMatch = dailyText.match(SHEET_SANITIZATION_MATCH);
        if (!dailyMatch) throw new Error(`Missing data for key ${slideKey}.`);

        const staticMatch = staticText.match(SHEET_SANITIZATION_MATCH);
        if (!staticMatch) throw new Error(`Missing static data.`);

        const dailyJson = JSON.parse(dailyMatch[0]);
        const dailyRows = dailyJson?.table?.rows;
        if (!dailyRows) throw new Error(`Missing data for key ${slideKey}.`);

        const staticJson = JSON.parse(staticMatch[0]);
        const staticRows = staticJson?.table?.rows;
        if (!staticRows) throw new Error(`Missing static data.`);

        const dailyData = dailyRows[0];
        if (!dailyData) throw new Error(`Missing data for key ${slideKey}.`);

        const staticData = staticRows[0];
        if (!staticData) throw new Error(`Missing static data.`);

        return {
            memeUrl: dailyData.c[1]?.v,
            thisDayInHistory: dailyData.c[0]?.v ?? "Nothing apparently...",
            discussion: dailyData.c[2]?.v ?? "",

            mustDos: ((staticData.c[0]?.v ?? "") as string).replaceAll("- ", "").split("\n"),
            mayDos: ((staticData.c[1]?.v ?? "") as string).replaceAll("- ", "").split("\n"),
        }
    }
}