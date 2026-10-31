/* eslint-disable @next/next/no-img-element */
// Subtest illustrations from the "Gamification x Mastery – Desktop" Figma file
// (component "Illustration / Subtest", node 4:2170). Each illustration is
// composed of the original vector pieces exported from Figma, positioned on a
// 48×48 grid exactly as in the design, then scaled to the requested size.

import type { CSSProperties, ReactNode } from "react";

export type SubtestId = "PU" | "PPU" | "PBM" | "PK" | "LBI" | "LBE" | "PM";

const src = (hash: string) => `/academy/subtest/${hash}.svg`;

/** Absolutely positioned vector piece. */
function V({ h, className, style }: { h: string; className: string; style?: CSSProperties }) {
  return (
    <div className={`absolute ${className}`} style={style}>
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={src(h)} />
    </div>
  );
}

/** Vector piece wrapped in a rotated / transformed container (Figma rotation). */
function R({
  box,
  inner,
  transform,
  h,
  imgInset,
  blend,
}: {
  box: string;
  inner: string;
  transform: string;
  h: string;
  imgInset?: string;
  blend?: boolean;
}) {
  return (
    <div className={`absolute flex items-center justify-center ${box} ${blend ? "mix-blend-soft-light" : ""}`}>
      <div className={`flex-none ${transform}`}>
        <div className={`relative ${inner}`}>
          {imgInset ? (
            <div className={`absolute ${imgInset}`}>
              <img alt="" className="block max-w-none size-full" src={src(h)} />
            </div>
          ) : (
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={src(h)} />
          )}
        </div>
      </div>
    </div>
  );
}

function PU() {
  return (
    <>
      <V h="d016f" className="h-[22.938px] left-[6.03px] top-[9.63px] w-[39.068px]" />
      <V h="a606b" className="inset-[67.92%_16.02%_11.04%_50.92%]" />
      <V h="0e9ed" className="h-[2.008px] left-[28.02px] top-[38.26px] w-[5.042px]" />
      <V h="12c88" className="h-[1.934px] left-[24.51px] top-[34.73px] w-[5.946px]" />
      <V h="d151d" className="h-[1.39px] left-[30.03px] top-[41.31px] w-[4.66px]" />
      <V h="049d1" className="inset-[67.92%_12.14%_11.04%_54.8%]" />
      <V h="91f09" className="h-[4.437px] left-[29.89px] top-[38.26px] w-[5.488px]" />
      <V h="8f20f" className="inset-[18.7%_7.83%_24.15%_5.02%]" />
      <V h="f096a" className="h-[2.596px] left-[4.32px] top-[17.41px] w-[4.259px]" />
      <V h="0b389" className="h-[1.581px] left-[6.26px] top-[13.96px] w-[6.389px]" />
      <V h="0d619" className="h-[1.399px] left-[11.9px] top-[10.33px] w-[6.017px]" />
      <V h="660f2" className="h-[0.388px] left-[20.14px] top-[8.98px] w-[4.762px]" />
      <V h="85753" className="h-[3.678px] left-[2.41px] top-[23.41px] w-[3.338px]" />
      <V h="a28d4" className="h-[1.335px] left-[12.92px] top-[32.89px] w-[7.094px]" />
      <V h="57d5e" className="h-[0.714px] left-[15.28px] top-[35.69px] w-[4.729px]" />
      <V h="85c37" className="h-[1.742px] left-[5.08px] top-[30.01px] w-[6.325px]" />
      <V h="6f57f" className="h-[1.03px] left-[9.05px] top-[12.97px] w-[4.976px]" />
      <V h="73746" className="h-[1.03px] left-[17.92px] top-[9.63px] w-[5.243px]" />
      <V h="65ca9" className="inset-[20.09%_4.13%_28.7%_14.13%]" />
      <V h="7c316" className="inset-[18.7%_3.13%_24.15%_9.73%]" />
      <R
        box="left-[7.25px] size-[35.649px] top-[5.56px]"
        inner="h-[34.474px] w-[15.941px]"
        transform="rotate-45"
        h="b84e4"
        blend
      />
      <V h="42e2b" className="inset-[42.26%_18.15%_33.7%_42.78%]" />
      <V h="f9b1e" className="inset-[42.74%_18.15%_33.22%_42.78%]" />
      <V h="91301" className="inset-[33.25%_63.23%_48.72%_24.75%]" />
      <V h="fec12" className="inset-[33.73%_63.23%_48.24%_24.75%]" />
      <V h="2e99b" className="inset-[24.25%_57.22%_69.74%_30.76%]" />
      <V h="1ed83" className="inset-[24.71%_57.22%_69.28%_30.76%]" />
      <V h="b9418" className="inset-[57.29%_9.14%_33.7%_84.85%]" />
      <V h="9873b" className="inset-[57.76%_9.14%_33.22%_84.85%]" />
      <V h="9873a" className="h-[22.891px] left-[23.79px] top-[8.98px] w-[22.707px]" />
    </>
  );
}

function Bar({ box, rot, inner }: { box: string; rot: string; inner: string }) {
  return (
    <div className={`absolute flex items-center justify-center ${box}`}>
      <div className={`flex-none ${rot}`}>
        <div className={`relative ${inner}`} />
      </div>
    </div>
  );
}

function PPU() {
  return (
    <>
      <div className="absolute h-[5.29px] left-[21.03px] pointer-events-none top-[38.8px] w-[3.936px]">
        <div aria-hidden className="absolute bg-[#a79fc0] inset-0" />
        <div className="absolute inset-0 rounded-[inherit] shadow-[inset_1.5px_1.53px_0px_0px_#877da6]" />
      </div>
      <div className="absolute bg-[#c7c1d9] h-[3.771px] left-[22.3px] top-[40.32px] w-[1.391px]" />
      <V h="7b283" className="h-[4.111px] left-[13.41px] top-[42.95px] w-[17.315px]" />
      <V h="a2d0b" className="h-[1.174px] left-[13.61px] top-[45.89px] w-[16.919px]" />
      <R
        box="h-[1.174px] left-[13.61px] top-[42.95px] w-[16.919px]"
        inner="h-[1.174px] w-[16.919px]"
        transform="-scale-y-100"
        h="b1df2"
      />
      <V h="bbef0" className="h-[4.111px] left-[15.27px] top-[42.95px] w-[17.315px]" />
      <Bar box="h-[32.231px] left-[11.52px] top-[3.15px] w-[22.956px]" rot="rotate-34" inner="bg-[#a79fc0] h-[37.063px] w-[2.691px]" />
      <Bar box="h-[26.315px] left-[14.43px] top-[5.05px] w-[18.175px]" rot="rotate-34" inner="bg-[#c7c1d9] h-[31.106px] w-[0.942px]" />
      <Bar box="h-[2.444px] left-[12.11px] top-[32.36px] w-[2.074px]" rot="rotate-34" inner="bg-[#c7c1d9] h-[2.313px] w-[0.942px]" />
      <Bar box="h-[3.016px] left-[31.22px] top-[3.15px] w-[3.25px]" rot="rotate-34" inner="bg-[#877da6] h-[1.823px] w-[2.691px]" />
      <Bar box="h-[3.016px] left-[12.69px] top-[30.63px] w-[3.25px]" rot="rotate-34" inner="bg-[#877da6] h-[1.823px] w-[2.691px]" />
      <V h="c61ce" className="h-[38.928px] left-[8.59px] top-[0.75px] w-[34.83px]" />
      <R
        box="h-[3.707px] left-[8.47px] top-[32.13px] w-[4.536px]"
        inner="h-[1.267px] w-[4.652px]"
        transform="rotate-[35.02deg]"
        h="3aa9b"
      />
      <R
        box="h-[3.707px] left-[30.17px] top-[0.76px] w-[4.536px]"
        inner="h-[1.267px] w-[4.652px]"
        transform="rotate-[35.02deg]"
        h="3aa9b"
      />
      <V h="06943" className="h-[38.415px] left-[9.73px] top-[1.31px] w-[33.133px]" />
      <V h="a7161" className="h-[38.415px] left-[9.73px] top-[1.31px] w-[32.749px]" />
      <V h="cdd27" className="left-[7.5px] size-[30.989px] top-[3.77px]" />
      <V h="75a77" className="h-[28.22px] left-[9.47px] top-[3.77px] w-[29.022px]" />
      <div className="absolute h-[15.478px] left-[19.86px] top-[19.29px] w-[14.778px]">
        <div className="absolute inset-[0_0_17.89%_0]">
          <img alt="" className="block max-w-none size-full" src={src("1b8b9")} />
        </div>
      </div>
      <V h="cf603" className="h-[17.938px] left-[9.47px] top-[4.78px] w-[12.552px]" />
      <V h="5de60" className="h-[7.156px] left-[21.45px] top-[3.77px] w-[8px]" />
      <V h="ebf18" className="h-[25.788px] left-[7.5px] top-[8.98px] w-[29.043px]" />
      <div className="absolute h-[22.512px] left-[10.18px] mix-blend-soft-light top-[5.19px] w-[26.888px]">
        <div className="absolute inset-[0_0_34.41%_13.71%]">
          <img alt="" className="block max-w-none size-full" src={src("2047b")} />
        </div>
      </div>
      <V h="06bb0" className="h-[3.004px] left-[21.21px] top-[31.76px] w-[6.317px]" />
      <V h="9b44d" className="h-[13.393px] left-[8.31px] top-[8.98px] w-[3.101px]" />
      <V h="59ae8" className="h-[38.337px] left-[22.69px] top-[1.39px] w-[20.759px]" />
    </>
  );
}

function PBM() {
  const spine = [8.19, 12.48, 16.77, 21.05, 25.34, 29.62, 33.91, 38.2];
  const rings = [11.41, 15.69, 19.97, 24.25, 28.55, 32.84, 37.12];
  const line = (box: string, inner: string, h: string, inset: string) => (
    <div className={`absolute flex items-center justify-center ${box}`}>
      <div className="-scale-y-100 flex-none rotate-167">
        <div className={`relative ${inner}`}>
          <div className={`absolute ${inset}`}>
            <img alt="" className="block max-w-none size-full" src={src(h)} />
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[48px] top-1/2">
      <R
        box="h-[41.593px] left-[7.14px] top-[5.64px] w-[34.828px]"
        inner="h-[36.374px] w-[27.346px]"
        transform="-rotate-13"
        h="600a2"
      />
      <V h="3e77c" className="h-[11.191px] left-[15.95px] top-[35.8px] w-[25.74px]" />
      <V h="a454e" className="h-[3.601px] left-[39.29px] top-[37.15px] w-[4.44px]" />
      <V h="e1435" className="h-[3.986px] left-[7.56px] top-[8.59px] w-[6.155px]" />
      {spine.map((top, i) => (
        <V key={`s${i}`} h="4b635" className="h-[6.744px] w-[5.139px]" style={{ left: 8.91 + i * 0.99, top }} />
      ))}
      {rings.map((top, i) => (
        <V key={`r${i}`} h="7c217" className="h-[5.284px] w-[2.652px]" style={{ left: 7.94 + i * 0.99, top }} />
      ))}
      <V h="42e8f" className="h-[5.148px] left-[14.87px] top-[41.41px] w-[2.978px]" />
      <R
        box="h-[41.593px] left-[9.37px] top-[2.14px] w-[34.828px]"
        inner="h-[36.374px] w-[27.346px]"
        transform="-rotate-13"
        h="c01c7"
      />
      <R
        box="h-[44.907px] left-[8.56px] top-[0.22px] w-[35.48px]"
        inner="h-[43.985px] w-[14.353px]"
        transform="rotate-32"
        h="53600"
        blend
      />
      <R
        box="h-[41.593px] left-[9.37px] top-[2.14px] w-[34.828px]"
        inner="h-[36.374px] w-[27.346px]"
        transform="-rotate-13"
        h="90c11"
      />
      {line("h-[3.994px] left-[16.19px] top-[9.02px] w-[16.725px]", "h-[0.144px] w-[17.131px]", "79ec0", "inset-[-358.43%_-3.02%_-358.42%_-1.96%]")}
      {line("h-[2.832px] left-[17.03px] top-[13.79px] w-[11.691px]", "h-[0.144px] w-[11.965px]", "9c1d0", "inset-[-358.43%_-4.33%_-358.42%_-3.06%]")}
      {line("h-[2.832px] left-[17.86px] top-[17.4px] w-[11.691px]", "h-[0.144px] w-[11.965px]", "9c1d0", "inset-[-358.43%_-4.33%_-358.42%_-3.06%]")}
      <R
        box="h-[9.76px] left-[13.62px] top-[31.63px] w-[10.938px]"
        inner="h-[9.086px] w-[6.202px]"
        transform="rotate-[-61.79deg]"
        h="dd514"
      />
      <R
        box="h-[30.029px] left-[3.98px] top-[7.6px] w-[22.439px]"
        inner="h-[32.921px] w-[4.879px]"
        transform="rotate-[-33.97deg]"
        h="1bfd3"
        imgInset="inset-[0_-3.23%_0_-3.22%]"
      />
    </div>
  );
}

/** One tile of the PK (+ − × =) calculator illustration. */
function PkTile({ x, y, glyph }: { x: number; y: number; glyph: ReactNode }) {
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <div className="absolute bg-[#008c6c] left-[0.82px] rounded-[1.776px] size-[18.7px] top-[2.83px]" />
      <V h="13a8c" className="h-[2.569px] left-[0.82px] top-[2.83px] w-[18.7px]" />
      <R
        box="h-[2.565px] left-[0.82px] top-[18.97px] w-[18.7px]"
        inner="h-[2.565px] w-[18.7px]"
        transform="-scale-y-100"
        h="4a2ad"
      />
      <V h="389fa" className="left-[2.83px] size-[18.7px] top-[2.83px]" />
      <V h="c75b3" className="h-[17.416px] left-[2.83px] top-[4.12px] w-[17.696px]" />
      <R box="left-0 size-[24.37px] top-0" inner="h-[24.974px] w-[9.49px]" transform="rotate-45" h="3e049" blend />
      {glyph}
    </div>
  );
}

function PK() {
  return (
    <>
      <PkTile
        x={1.5}
        y={0.75}
        glyph={
          <>
            <V h="8d746" className="left-[7.62px] size-[10.626px] top-[6.87px]" />
            <V h="42bed" className="left-[6.87px] size-[10.626px] top-[6.87px]" />
          </>
        }
      />
      <PkTile
        x={24.68}
        y={0.75}
        glyph={
          <>
            <V h="38f26" className="h-[2.499px] left-[9.51px] top-[10.93px] w-[6.846px]" />
            <V h="fdaa7" className="h-[2.499px] left-[8.76px] top-[10.93px] w-[6.846px]" />
          </>
        }
      />
      <PkTile
        x={1.5}
        y={23.09}
        glyph={
          <>
            <V h="fbaab" className="h-[9.3px] left-[8.27px] top-[7.54px] w-[9.331px]" />
            <V h="7f922" className="h-[9.3px] left-[7.52px] top-[7.54px] w-[9.331px]" />
          </>
        }
      />
      <V h="72ed2" className="left-[24.68px] size-[24.37px] top-[23.09px]" />
    </>
  );
}

/** Shared shape for the two "book" illustrations (LBI / LBE). */
function Book({
  label,
  fontSize,
  p,
}: {
  label: string;
  fontSize: number;
  p: {
    cover: [string, string, string, string];
    back: [string, string, string, string];
    page: [string, string, string, string];
    clip: [string, string, string, string];
    face: [string, string, string, string];
    faceIn: [string, string, string, string];
    edge1: [string, string, string, string];
    edge2: [string, string, string, string];
    band: [string, string, string, string];
    bandIn: [string, string, string, string];
    text: string;
    shine: [string, string, string];
  };
}) {
  const r = (v: [string, string, string, string]) => (
    <R box={v[0]} inner={v[1]} transform="-rotate-13" h={v[2]} imgInset={v[3] || undefined} />
  );
  return (
    <>
      {r(p.cover)}
      {r(p.back)}
      {r(p.page)}
      {r(p.clip)}
      {r(p.face)}
      {r(p.faceIn)}
      {r(p.edge1)}
      {r(p.edge2)}
      {r(p.band)}
      {r(p.bandIn)}
      <div className={`-translate-x-1/2 absolute flex items-center justify-center ${p.text}`}>
        <div className="-rotate-13 flex-none">
          <p
            className="font-[family-name:var(--font-nunito)] font-extrabold leading-[normal] relative text-center text-white whitespace-nowrap"
            style={{ fontSize }}
          >
            {label}
          </p>
        </div>
      </div>
      <R box={p.shine[0]} inner={p.shine[1]} transform="rotate-32" h={p.shine[2]} imgInset="inset-[1.63%_0_0_0]" blend />
    </>
  );
}

function LBI() {
  return (
    <Book
      label="IDN"
      fontSize={11.41}
      p={{
        cover: ["h-[44.804px] left-[4.06px] top-[2.15px] w-[36.668px]", "h-[39.394px] w-[28.538px]", "de721", ""],
        back: ["h-[40.895px] left-[4.96px] top-[6.06px] w-[35.765px]", "h-[35.382px] w-[28.538px]", "14841", ""],
        page: ["h-[26.338px] left-[8.32px] top-[20.62px] w-[32.405px]", "h-[20.442px] w-[28.538px]", "71fba", ""],
        clip: ["h-[9.288px] left-[11px] top-[37.67px] w-[6.054px]", "h-[8.554px] w-[4.238px]", "f5834", ""],
        face: ["h-[42.731px] left-[6.59px] top-[0.95px] w-[36.189px]", "h-[37.267px] w-[28.538px]", "e4737", ""],
        faceIn: ["h-[40.774px] left-[6.96px] top-[2.91px] w-[34.378px]", "h-[35.598px] w-[27.064px]", "7c3d6", ""],
        edge1: ["h-[11.276px] left-[12.14px] top-[35.27px] w-[29.736px]", "h-[4.781px] w-[29.414px]", "83eb2", ""],
        edge2: ["h-[11.21px] left-[13.22px] top-[33.49px] w-[28.68px]", "h-[4.975px] w-[28.286px]", "39c7f", ""],
        band: ["h-[23.677px] left-[10.98px] top-[20px] w-[31.79px]", "h-[17.712px] w-[28.538px]", "424c2", ""],
        bandIn: ["h-[23.346px] left-[10.98px] top-[20.34px] w-[30.355px]", "h-[17.712px] w-[27.064px]", "709fa", ""],
        text: "h-[20.07px] left-[22.81px] top-[5.1px] w-[24.005px]",
        shine: ["h-[46.202px] left-[6.65px] top-[-0.98px] w-[35.447px]", "h-[46.531px] w-[12.723px]", "f2ad8"],
      }}
    />
  );
}

function LBE() {
  return (
    <Book
      label="ENG"
      fontSize={11.61}
      p={{
        cover: ["h-[45.572px] left-[4.06px] top-[1.73px] w-[37.296px]", "h-[40.069px] w-[29.027px]", "60918", ""],
        back: ["h-[41.596px] left-[4.98px] top-[5.7px] w-[36.378px]", "h-[35.989px] w-[29.027px]", "78fa9", ""],
        page: ["h-[26.789px] left-[8.4px] top-[20.51px] w-[32.96px]", "h-[20.792px] w-[29.027px]", "96a67", ""],
        clip: ["h-[9.447px] left-[11.12px] top-[37.85px] w-[6.158px]", "h-[8.701px] w-[4.311px]", "bda71", ""],
        face: ["h-[43.463px] left-[6.63px] top-[0.5px] w-[36.81px]", "h-[37.905px] w-[29.027px]", "2568a", ""],
        faceIn: ["h-[41.472px] left-[7.01px] top-[2.49px] w-[34.968px]", "h-[36.208px] w-[27.528px]", "86abe", ""],
        edge1: ["h-[11.469px] left-[12.28px] top-[35.41px] w-[30.246px]", "h-[4.863px] w-[29.919px]", "9f483", ""],
        edge2: ["h-[11.403px] left-[13.37px] top-[33.6px] w-[29.172px]", "h-[5.06px] w-[28.771px]", "2f29c", ""],
        band: ["h-[24.083px] left-[11.1px] top-[19.88px] w-[32.335px]", "h-[18.015px] w-[29.027px]", "8d934", ""],
        bandIn: ["h-[23.746px] left-[11.1px] top-[20.22px] w-[30.875px]", "h-[18.015px] w-[27.528px]", "258f5", ""],
        text: "h-[20.914px] left-[23.44px] top-[4.21px] w-[27.659px]",
        shine: ["h-[46.994px] left-[6.7px] top-[-1.46px] w-[36.055px]", "h-[47.328px] w-[12.941px]", "6255d"],
      }}
    />
  );
}

function PM() {
  const skewL = (h: string, left: string, top: string) => (
    <div className={`absolute flex h-[19.274px] items-center justify-center ${left} ${top} w-[12.015px]`}>
      <div className="flex-none rotate-27 scale-y-89 skew-x-27">
        <div className="h-[13.152px] relative w-[13.485px]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={src(h)} />
        </div>
      </div>
    </div>
  );
  return (
    <>
      <div className="absolute bg-[#ffb7ec] left-[19.9px] size-[8.352px] top-[17.18px]" />
      <V h="963b6" className="h-[18.75px] left-[2.62px] top-[2.01px] w-[42.671px]" />
      <V h="933c3" className="h-[18.094px] left-[3.85px] mix-blend-soft-light top-[2.67px] w-[26.282px]" />
      <V h="805a4" className="h-[8.763px] left-[35.22px] mix-blend-soft-light top-[6.43px] w-[10.076px]" />
      <V h="47259" className="h-[11.487px] left-[3.97px] top-[2.01px] w-[41.323px]" />
      <V h="12426" className="h-[4.464px] left-[4.53px] top-[8.54px] w-[39.574px]" />
      <R
        box="h-[19.195px] left-[5.21px] top-[26.48px] w-[38.302px]"
        inner="h-[19.195px] w-[38.302px]"
        transform="-scale-y-100"
        h="608db"
        imgInset="inset-[0_0_1.87%_0]"
      />
      <V h="3b599" className="h-[3.598px] left-[16.01px] top-[17.17px] w-[15.034px]" />
      <V h="90bb0" className="h-[34.111px] left-[2.62px] top-[11.32px] w-[21.336px]" />
      <div className="absolute h-[34.137px] left-[22.31px] top-[11.3px] w-[22.979px]">
        <div className="absolute inset-[0_0_0_7.15%]">
          <img alt="" className="block max-w-none size-full" src={src("cb547")} />
        </div>
      </div>
      <V h="8facd" className="h-[33.976px] left-[23.96px] top-[11.46px] w-[19.693px]" />
      <R
        box="h-[36.934px] left-[20.33px] top-[10.14px] w-[29.171px]"
        inner="h-[39.432px] w-[8.043px]"
        transform="rotate-[34.93deg]"
        h="73432"
        blend
      />
      {skewL("b1aaa", "left-[5.77px]", "top-[19.41px]")}
      {skewL("56df6", "left-[6.29px]", "top-[19.29px]")}
      <V h="cab35" className="h-[12.259px] left-[28.41px] top-[22.53px] w-[15.095px]" />
      <V h="ebe42" className="h-[12.259px] left-[27.8px] top-[22.53px] w-[15.095px]" />
      <div className="absolute flex h-[5.546px] items-center justify-center left-[18.72px] top-[7.46px] w-[9.606px]">
        <div className="-skew-x-30 flex-none rotate-30 scale-y-87">
          <div className="h-[5.632px] relative w-[5.46px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={src("183fc")} />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[5.459px] items-center justify-center left-[18.8px] top-[8.04px] w-[9.455px]">
        <div className="-skew-x-30 flex-none rotate-30 scale-y-87">
          <div className="relative size-[5.459px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={src("08bf1")} />
          </div>
        </div>
      </div>
      <R
        box="h-[40.222px] left-[-7.51px] top-[11.51px] w-[30.958px]"
        inner="h-[39.475px] w-[12.398px]"
        transform="-rotate-31"
        h="3e909"
      />
    </>
  );
}

const ART: Record<SubtestId, () => ReactNode> = { PU, PPU, PBM, PK, LBI, LBE, PM };

export default function SubtestIllustration({
  id,
  size = 48,
  className = "",
}: {
  id: SubtestId;
  size?: number;
  className?: string;
}) {
  const Art = ART[id];
  return (
    <div
      aria-hidden
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute left-0 top-0 overflow-clip size-[48px] origin-top-left"
        style={{ transform: `scale(${size / 48})` }}
      >
        <Art />
      </div>
    </div>
  );
}
