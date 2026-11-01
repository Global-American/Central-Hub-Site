import * as React from "react";

// The "it" from the itSmart logos: the dot, the stem and a "t" whose tail
// curves into an arrow. Same paths as public/shipItSmartIcon.svg without the
// circle, cropped to the letters so it can sit in a line of text: the bottom of
// the stem is the baseline, 31 units above the bottom of the viewBox where the
// arrow dips below it. Fills with currentColor.
export default function ItMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="485 348 1264 1278"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path transform="translate(725,530)" d="m0 0h65l63 1 1 4-1 400 813 1 2 5-1 123-808 1-11 1v84l3 49 3 25 8 49 6 28 5 19 9 27 12 28 10 19 10 15 10 13 14 15 10 9 13 9 14 8 19 8 21 6 25 4 8 1h37l28-3 30-5 34-8 41-12 35-12 28-11 35-16 33-15 19-10 14-7 4-3-2-4-14-18-8-12-10-13-13-18-11-16-7-12-4-11-1-5v-18l4-11 6-11 10-13 11-9 11-5 13-3h69l144 3h85l5-4 9 1 28 9 11 3 9 11 11 15 7 11v10l-3 7-1 18-7 29-11 36-9 28-9 30-10 31-12 39-6 20-9 28-9 30-5 18-8 19-10 13-7 7-9 6-12 5-9 2h-12l-14-3-12-5-9-6-7-7-13-17-12-17-14-19-13-18-10-14-12-17-8-11-6-9-3-1-10 6-32 17-27 13-36 16-28 12-30 12-37 13-38 12-31 8-37 8-34 5-21 2h-42l-39-3-26-4-27-7-25-9-26-12-17-10-20-14-13-11-11-9-12-12-7-8-12-15-10-14-10-16-9-16-13-25-8-19-13-37-8-27-8-37-8-43-4-30-3-33-3-55-1-39v-19l1-61 1-490z" />
      <path transform="translate(509,666)" d="m0 0h110l17 1v926l-1 1-14 1h-113v-928z" />
      <path transform="translate(566,348)" d="m0 0 18 1 16 4 16 7 12 9 6 5 11 14 8 15 4 13 2 14v9l-2 16-5 15-7 13-12 14-9 8-14 9-12 5-16 4h-18l-17-4-13-5-11-6-10-8-8-8-9-13-7-16-3-11-1-7v-22l4-17 8-16 9-12 9-10 10-7 12-6 15-5z" />
    </svg>
  );
}
