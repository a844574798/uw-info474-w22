import React, { useState } from "react";
import { scaleLinear, scaleBand, timeParse, scaleTime, extent, line, symbol, csv } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { uniq } from "lodash";
import senate2018 from "./2018_senate_seat_forecasets_538"
import * as d3 from "d3";


function App() {
    
  const tennessee = senate2018.filter(forecast => (forecast.state === "TN") && (forecast.model === "deluxe"));
  const tennesseeD = senate2018.filter(forecast => (forecast.state === "TN") && (forecast.model === "deluxe") && (forecast.candidate === "Phil Bredesen"));
  const tennesseeLite = senate2018.filter(forecast => (forecast.state === "TN") && (forecast.model === "lite"));
  const tennesseeClassic = senate2018.filter(forecast => (forecast.state === "TN") && (forecast.model === "classic"));
  const voteshareBredesen = [];
  const voteshareBlackburn = [];
  const voteshareOther = [];
  const winprobBredesen = [];
  const winprobBlackburn = [];
  const winprobOther = [];
  const voteshareBredesenL = [];
  const voteshareBlackburnL = [];
  const winprobBredesenL = [];
  const winprobBlackburnL = [];
  const dates = [];
  const datesL = [];
  const days = ["2018-08-01", "2018-09-01", "2018-10-01", "2018-11-01"];
  const testTime = [];
  const parseTime = timeParse("%Y-%m-%d");
  days.forEach((day) => testTime.push(parseTime(day)));
  const winprobBredesenC = [];
  const datesC = [];

  tennessee.forEach((forecast) => {
    if (forecast.candidate === "Phil Bredesen") {
      voteshareBredesen.push(forecast.voteshare);
      winprobBredesen.push(forecast.win_probability);
      let time = forecast.forecastdate;
      dates.push(parseTime(time));
    }

    if (forecast.candidate === "Marsha Blackburn") {
      voteshareBlackburn.push(forecast.voteshare);
      winprobBlackburn.push(forecast.win_probability);
    }
    if (forecast.candidate === "Others") {
      voteshareOther.push(forecast.voteshare);
      winprobOther.push(forecast.win_probability);
    }
  });

  tennesseeLite.forEach((forecast) => {
    if (forecast.candidate === "Phil Bredesen") {
      voteshareBredesenL.push(forecast.voteshare);
      winprobBredesenL.push(forecast.win_probability);
      let time = forecast.forecastdate;
      datesL.push(parseTime(time));
    }

    if (forecast.candidate === "Marsha Blackburn") {
      voteshareBlackburnL.push(forecast.voteshare);
      winprobBlackburnL.push(forecast.win_probability);
    }
  });

  tennesseeClassic.forEach((forecast) => {
    if (forecast.candidate === "Phil Bredesen") {
      winprobBredesenC.push(forecast.win_probability);
      let time = forecast.forecastdate;
      datesC.push(parseTime(time));
    }
  });

  const absDifference = (arr1, arr2) => {
    const res = [];
    for (let i = 0; i < arr1.length; i++) {
      const el = Math.abs((arr1[i] || 0) - (arr2[i] || 0));
      res[i] = el;
    };
    return res;
  };

  const voteMargin = absDifference(voteshareBredesen, voteshareBlackburn);
  const voteshares = { "Bredesen(D)": voteshareBredesen, "Blackburn(R)": voteshareBlackburn };
  const winprobs = { "Bredesen(D)": winprobBredesen, "Blackburn(R)": winprobBlackburn };
  const candidates = ["Bredesen(D)", "Blackburn(R)"];
  const months = ["August", "September", "October", "November"];
  const votesharesL = { "Bredesen(D)": voteshareBredesenL, "Blackburn(R)": voteshareBlackburnL };
  const winprobsL = { "Bredesen(D)": winprobBredesenL, "Blackburn(R)": winprobBlackburnL };
  const modelWinProbs = { "deluxe": winprobBredesen, "classic": winprobBredesenC, "lite": winprobBredesenL };

  const chartSize = 500;
  const margin = 70;
  const legendPadding = 100;
  const _extent = extent(winprobBlackburn);
  const _scaleY = scaleLinear()
    .domain([0, _extent[1]])
    .range([chartSize - margin, margin]);
  const _scaleLine = scaleLinear()
    .domain([0, 70])
    .range([margin, chartSize - margin]);
  const domain = extent(dates);
  const _scaleDate = scaleTime()
    .domain(domain)
    .range([0, chartSize]);

  //const _scaleDate = scaleBand().domain(months).range([-margin, chartSize - 80]);
  const _lineMaker = line()
    .x((d, i) => {
      return _scaleLine(i);
    })
    .y((d) => {
      return _scaleY(d);
    });



  var minVoteShare = d3.min(voteshareBredesen);
  var maxVoteShare = d3.max(voteshareBredesen);
  var minWinProbD = d3.min(winprobBredesen);
  var maxWinProbD = d3.max(winprobBredesen);
  var minVoteShareL = d3.min(voteshareBredesenL);
  var maxVoteShareL = d3.max(voteshareBredesenL);

  const voteShareChartWidth = 500;
  const voteShareChartHeight = 200;
  const voteShareMargin = 70;
  const voteShareAxisTextPadding = 10;


  const voteShareScale = scaleLinear()
    .domain([minVoteShare, maxVoteShare])
    .range([voteShareMargin, voteShareChartWidth - voteShareMargin - voteShareMargin]);
  const voteShareScaleL = scaleLinear()
    .domain([minVoteShareL, maxVoteShareL])
    .range([voteShareMargin, voteShareChartWidth - voteShareMargin - voteShareMargin]);

  const winProbScaleD = scaleLinear()
    .domain([minWinProbD, maxWinProbD])
    .range([voteShareMargin, voteShareChartWidth - voteShareMargin - voteShareMargin]);

  var minVoteShareR = d3.min(voteshareBlackburn);
  var maxVoteShareR = d3.max(voteshareBlackburn);
  const voteShareScaleR = scaleLinear()
    .domain([minVoteShareR, maxVoteShareR])
    .range([voteShareMargin, voteShareChartWidth - voteShareMargin - voteShareMargin]);

  var minVoteShareRL = d3.min(voteshareBlackburnL);
  var maxVoteShareRL = d3.max(voteshareBlackburnL);
  const voteShareScaleRL = scaleLinear()
    .domain([minVoteShareRL, maxVoteShareRL])
    .range([voteShareMargin, voteShareChartWidth - voteShareMargin - voteShareMargin]);

  const _scaleVoteShare = scaleLinear()
    .domain([40, 55])
    .range([chartSize - margin, margin]);


  const _lineMakerVote = line()
    .x((d, i) => {
      return _scaleLine(i);
    })
    .y((d) => {
      return _scaleVoteShare(d);
    });

  const vBinGenerator = d3.bin().value((d) => d.voteshare);

  const BredesenVoteBins = vBinGenerator(tennesseeD);
  const voteShareBredBarHeightScale = scaleLinear()
    .domain([0, d3.max(BredesenVoteBins, (d) => d.length)])
    .range([
      voteShareChartHeight - voteShareMargin - voteShareAxisTextPadding,
      voteShareMargin,
    ]);

  const wBinGenerator = d3.bin().value((d) => d.win_probability);

  const BredesenWinProbBins = wBinGenerator(tennesseeD);
  const winProbBredBarHeightScale = scaleLinear()
    .domain([0, d3.max(BredesenWinProbBins, (d) => d.length)])
    .range([
      voteShareChartHeight - voteShareMargin - voteShareAxisTextPadding,
      voteShareMargin,
    ]);

  const [selectedModel, setSelectedModel] = useState(["deluxe"]);
  const models = ["deluxe", "classic", "lite"];
  const colors = {"deluxe":"black","classic":"red","lite":"blue"};

  return (
    <div style={{ margin: 20 }}>
      <h1>2018 Senate Forecast in the State of Tennessee and West Virginia</h1>
      <h2>Final Project INFO 474</h2>
      <h2>Part for Assignment 3</h2>
      <h3>Phil Bredesen's Predicted Winning Probabilities Based on Different Model</h3>
      <p>Check the box(es) to see how each prediction model looks like!</p>
      <div>
        {models.map((model, i) => {
          return (
            <>
              <input
                key={i}
                type="checkbox"
                id={model}
                name={model}
                checked={selectedModel.indexOf(model) > -1}
                onChange={() => {
                  if (selectedModel.indexOf(model) === -1) {
                    const updatedModels = [...selectedModel, model]
                    setSelectedModel(updatedModels);
                  } else {
                    setSelectedModel(
                      selectedModel.slice(0).filter((_model) => {
                        return model !== _model;
                      })
                    );
                  }
                }}
              />
              <label style={{ marginRight: 15 }}>{model}</label>
            </>
          );
        })}
      </div>
      <div style={{ display: "flex" }}>
        <svg
          width={chartSize + legendPadding}
          height={chartSize}
        >
          <AxisLeft strokeWidth={0} left={margin} scale={_scaleY} />
          <AxisBottom
            strokeWidth={0}
            top={chartSize - margin}
            left={margin}
            scale={_scaleDate}
            tickValues={testTime}
          />
          <text x="40" y="50" fontSize={15}>
            Predicted Winning Probability of Bredesen Over Time Based on Different Models
          </text>
          <text x="-390" y="15" transform="rotate(-90)" fontSize={15}>
            Phil Bredesen's Winning Probability Forecast
          </text>
          <text x="-390" y="30" transform="rotate(-90)" fontSize={15}>
            from 08/01/2018-11/06/2018
          </text>
          {selectedModel.map((model, i) => {
            return (
              <path
                stroke={colors[model]}
                strokeWidth={2}
                fill="none"
                key={model}
                d={_lineMaker(modelWinProbs[model])}
              />
            );
          })}
          {selectedModel.map((model, i) => {
            return (
              <text
                fill={colors[model]}
                style={{
                  fontSize: 15
                }}
                key={`legend--${model}`}
                x={chartSize + 50}
                y={_scaleY(modelWinProbs[model][90])}
              >
                {model}
              </text>
            );
          })}
        </svg>
      </div>
      <p>
        <b>The question I want to investigate: What are the major discrepencies between the prediction models? If there are discrepencies, what events or prediction methods cause the discrepencies to happen?</b>
      </p>
      <p>
        For this assignment, my goal is to see the how each of the 538 models predicts Phil Bredesen's winning probabilities, and I want to see their
        differences. The best way to display the predicted winning probabilities would be through line graphs, as we can compare the model's predictions at
        different periods of time. Also, I think it would be the best for me to create a visualization that the users can pick and choose which model's prediction
        to display. For example, they can choose to display them all at once, or just display one or two to compare and interpret. Thus, I used checkboxes for 
        the users to pick and choose. I thought about using dot plots to display the data, but I think that would make the visualization too messy for analysis.
        I also considered the interaction that I would display all the lines at once and users can choose which one they want to highlight. However, I don't think
        that's the best way to design here because irrelevant data would be disturbing while doing interpretations and analysis.
      </p>
      <p>
        In terms of the development process, I did this assignment by myself. The development process was quite smooth except that part where I was
        trying to figure out how to assign different colors to the lines in the plot. Also, there are "indexOf" issues happened when I was creating the checkboxes, but it was resolved within an hour.
        I spent about 3 hours creating the application, and the checkbox(interaction) part took me the most time.
      </p>
      <p>
        Github Repository Link: <a href="https://github.com/a844574798/uw-info474-w22.git" target="_blank">https://github.com/a844574798/uw-info474-w22.git</a>
      </p>
      <h2>Part for Assignment 2</h2>
      <h3>Eight visualiztions using data predicted by the deluxe model:</h3>
      <div style={{ display: "flex" }}>
        <svg
          width={chartSize + legendPadding}
          height={chartSize}
          style={{ border: "1px solid black" }}
        >
          <AxisLeft strokeWidth={0} left={margin} scale={_scaleY} />
          <AxisBottom
            strokeWidth={0}
            top={chartSize - margin}
            left={margin}
            scale={_scaleDate}
            tickValues={testTime}
          />
          <text x="80" y="50" fontSize={20}>
            Predicted Winning Probability of Candidates Over Time
          </text>
          <text x="-390" y="15" transform="rotate(-90)" fontSize={15}>
            Senate Candidate Winning Probability Forecast
          </text>
          <text x="-390" y="30" transform="rotate(-90)" fontSize={15}>
            from 08/01/2018-11/06/2018
          </text>
          {candidates.map((candidate, i) => {
            return (
              <path
                stroke={candidate === "Blackburn(R)" ? "red" : "blue"}
                strokeWidth={candidate === "Blackburn(R)" ? 3 : 1}
                fill="none"
                key={candidate}
                d={_lineMaker(winprobs[candidate])}
              />
            );
          })}
          {candidates.map((candidate, i) => {
            return (
              <text
                fill={"black"}
                style={{
                  fontSize: 15,
                  fontWeight: candidate === "Blackburn(R)" ? 700 : 300,
                }}
                key={`legend--${candidate}`}
                x={chartSize}
                y={_scaleY(winprobs[candidate][45])}
              >
                {candidate}
              </text>
            );
          })}
        </svg>
        <svg
          width={chartSize}
          height={chartSize}
          style={{ border: "1px solid black" }}
        >
          <AxisLeft strokeWidth={0} left={margin} scale={_scaleY} />
          <AxisBottom
            strokeWidth={0}
            top={chartSize - margin}
            left={20}
            scale={voteShareScale}
            numTicks={10}
          />
          <text x="50" y="50" fontSize={15}>
            Correlation of voteshare and winning probability of Bredesen
          </text>
          <text x="-390" y="15" transform="rotate(-90)" fontSize={15}>
            Senate Candidate Winning Probability Forecast
          </text>
          <text x="-390" y="30" transform="rotate(-90)" fontSize={15}>
            from 08/01/2018-11/06/2018
          </text>
          <text x="100" y="475" fontSize={15}>
            Senate Candidate Predicted Vote Share
          </text>
          <text x="100" y="490" fontSize={15}>
            from 08/01/2018-11/06/2018
          </text>
          {voteshareBredesen.map((voteshare, i) => {
            var winProb = winprobBredesen[i];
            return (
              <circle
                key={i}
                cx={voteShareScale(voteshare)}
                cy={_scaleY(winProb)}
                r={5}
                style={{ stroke: "rgba(50,50,50)", fill: "none" }}
              />
            );

          })}
        </svg>
      </div>
      <div style={{ display: "flex" }}>
        {/*Add a mouse event on the svg that captures the x-position of the mouse hover and draw
        a vertical line on the chart */}
        <svg
          width={chartSize + legendPadding}
          height={chartSize}
          style={{ border: "1px solid black" }}
        >
          <AxisLeft strokeWidth={0} left={margin} scale={_scaleVoteShare} />
          <AxisBottom
            strokeWidth={0}
            top={chartSize - margin}
            left={margin}
            scale={_scaleDate}
            tickValues={testTime}
          />
          <text x="80" y="50" fontSize={20}>
            Predicted Vote Share of Candidates Over Time
          </text>
          <text x="-390" y="15" transform="rotate(-90)" fontSize={15}>
            Senate Candidate Vote Share Forecast
          </text>
          <text x="-390" y="30" transform="rotate(-90)" fontSize={15}>
            from 08/01/2018-11/06/2018
          </text>
          {candidates.map((candidate, i) => {
            return (
              <path
                stroke={candidate === "Blackburn(R)" ? "red" : "blue"}
                strokeWidth={candidate === "Blackburn(R)" ? 3 : 1}
                fill="none"
                key={candidate}
                d={_lineMakerVote(voteshares[candidate])}
              />
            );
          })}
          {candidates.map((candidate, i) => {
            return (
              <text
                fill={"black"}
                style={{
                  fontSize: 15,
                  fontWeight: candidate === "Blackburn(R)" ? 700 : 300,
                }}
                key={`legend--${candidate}`}
                x={chartSize}
                y={_scaleVoteShare(voteshares[candidate][45])}
              >
                {candidate}
              </text>
            );
          })}
        </svg>

        <svg
          width={chartSize}
          height={chartSize}
          style={{ border: "1px solid black" }}
        >
          <AxisLeft strokeWidth={0} left={margin} scale={_scaleY} />
          <AxisBottom
            strokeWidth={0}
            top={chartSize - margin}
            left={20}
            scale={voteShareScaleR}
            numTicks={10}
          />
          <text x="50" y="50" fontSize={15}>
            Correlation of voteshare and winning probability of Blackburn
          </text>
          <text x="-390" y="15" transform="rotate(-90)" fontSize={15}>
            Senate Candidate Winning Probability Forecast
          </text>
          <text x="-390" y="30" transform="rotate(-90)" fontSize={15}>
            from 08/01/2018-11/06/2018
          </text>
          <text x="100" y="475" fontSize={15}>
            Senate Candidate Predicted Vote Share
          </text>
          <text x="100" y="490" fontSize={15}>
            from 08/01/2018-11/06/2018
          </text>
          {voteshareBlackburn.map((voteshare, i) => {
            var winProb = winprobBlackburn[i];
            return (
              <circle
                key={i}
                cx={voteShareScaleR(voteshare)}
                cy={_scaleY(winProb)}
                r={5}
                style={{ stroke: "rgba(50,50,50)", fill: "none" }}
              />
            );

          })}
        </svg>
      </div>
      <p>Here we have a barcode plot of the predicted voteshare of Phil Bredesen:</p>
      <div>
        <svg
          height={voteShareChartHeight}
          width={voteShareChartWidth}
          style={{ border: "1px solid black" }}
        >
          <text x="60" y="175" fontSize={15}>
            Predicted Vote Share from 08/01/2018-11/06/2018
          </text>
          {voteshareBredesen.map((voteshare, i) => {
            return (
              <line
                key={i}
                x1={voteShareScale(voteshare)}
                y1={voteShareMargin}
                x2={voteShareScale(voteshare)}
                y2={voteShareChartHeight / 2}
                style={{ stroke: "rgba(70,130,180,.1)", fill: "none" }}
              />
            );
          })}
          <AxisBottom
            strokeWidth={1}
            top={voteShareChartHeight - voteShareMargin - voteShareAxisTextPadding}
            scale={voteShareScale}
            numTicks={7}
          />
        </svg>
      </div>

      <div>
        <p>Here is a strip plot of the voteshares of Phil Bredesen:</p>
        <svg
          height={voteShareChartHeight}
          width={voteShareChartWidth}
          style={{ border: "1px solid black" }}
        >
          <text x="60" y="175" fontSize={15}>
            Predicted Vote Share from 08/01/2018-11/06/2018
          </text>
          {voteshareBredesen.map((voteShares, i) => {
            return (
              <circle
                key={i}
                cx={voteShareScale(voteShares)}
                cy={voteShareChartHeight / 2}
                r={5}
                style={{ stroke: "rgba(50,50,50,.1)", fill: "none" }}
              />
            );
          })}
          <AxisBottom
            strokeWidth={1}
            top={voteShareChartHeight - voteShareMargin - voteShareAxisTextPadding}
            scale={voteShareScale}
            numTicks={10}
          />
        </svg>
      </div>

      <p>Here we show a histogram of predicted voteshare of Phil Bredesen.</p>
      <div>
        <svg width={voteShareChartWidth} height={voteShareChartHeight} style={{ border: "1px solid black" }}>
          <text x="60" y="175" fontSize={15}>
            Predicted Vote Share from 08/01/2018-11/06/2018
          </text>
          {BredesenVoteBins.map((bin, i) => {
            return (
              <rect
                key={i}
                fill="steelblue"
                x={voteShareScale(bin.x0) + 1}
                y={voteShareBredBarHeightScale(bin.length)}
                width={Math.max(
                  0,
                  voteShareScale(bin.x1) - voteShareScale(bin.x0) - 1
                )}
                height={
                  voteShareBredBarHeightScale(0) - voteShareBredBarHeightScale(bin.length)
                }
              />
            );
          })}
          {BredesenVoteBins.map((bin, i) => {
            return (
              <text
                key={i}
                fill="black"
                fontSize="10"
                textAnchor="middle"
                x={
                  ((voteShareScale(bin.x0) + voteShareScale(bin.x1)) / 2) |
                  0
                }
                y={voteShareBredBarHeightScale(bin.length) - 2}
              >
                {bin.length}
              </text>
            );
          })}
          <AxisBottom
            strokeWidth={1}
            top={voteShareChartHeight - voteShareMargin - voteShareAxisTextPadding}
            scale={voteShareScale}
            numTicks={7}
          />
        </svg>
      </div>

      <p>Here we show a histogram of predicted winning probability of Phil Bredesen.</p>
      <div>
        <svg width={voteShareChartWidth} height={voteShareChartHeight} style={{ border: "1px solid black" }}>
          <text x="50" y="175" fontSize={15}>
            Predicted winning probability from 08/01/2018-11/06/2018
          </text>
          {BredesenWinProbBins.map((bin, i) => {
            return (
              <rect
                key={i}
                fill="steelblue"
                x={winProbScaleD(bin.x0) + 1}
                y={winProbBredBarHeightScale(bin.length)}
                width={Math.max(
                  0,
                  winProbScaleD(bin.x1) - winProbScaleD(bin.x0) - 1
                )}
                height={
                  winProbBredBarHeightScale(0) - winProbBredBarHeightScale(bin.length)
                }
              />
            );
          })}
          {BredesenWinProbBins.map((bin, i) => {
            return (
              <text
                key={i}
                fill="black"
                fontSize="10"
                textAnchor="middle"
                x={
                  ((winProbScaleD(bin.x0) + winProbScaleD(bin.x1)) / 2) |
                  0
                }
                y={winProbBredBarHeightScale(bin.length) - 2}
              >
                {bin.length}
              </text>
            );
          })}
          <AxisBottom
            strokeWidth={1}
            top={voteShareChartHeight - voteShareMargin - voteShareAxisTextPadding}
            scale={winProbScaleD}
            numTicks={7}
          />
        </svg>
      </div>
      <h2>Here are the visualizations under lite model:</h2>
      <div style={{ display: "flex" }}>
        <svg
          width={chartSize + legendPadding}
          height={chartSize}
          style={{ border: "1px solid black" }}
        >
          <AxisLeft strokeWidth={0} left={margin} scale={_scaleY} />
          <AxisBottom
            strokeWidth={0}
            top={chartSize - margin}
            left={margin}
            scale={_scaleDate}
            tickValues={testTime}
          />
          <text x="80" y="50" fontSize={20}>
            Predicted Winning Probability of Candidates Over Time
          </text>
          <text x="-390" y="15" transform="rotate(-90)" fontSize={15}>
            Senate Candidate Winning Probability Forecast
          </text>
          <text x="-390" y="30" transform="rotate(-90)" fontSize={15}>
            from 08/01/2018-11/06/2018
          </text>
          {candidates.map((candidate, i) => {
            return (
              <path
                stroke={candidate === "Blackburn(R)" ? "red" : "blue"}
                strokeWidth={candidate === "Blackburn(R)" ? 3 : 1}
                fill="none"
                key={candidate}
                d={_lineMaker(winprobsL[candidate])}
              />
            );
          })}
          {candidates.map((candidate, i) => {
            return (
              <text
                fill={"black"}
                style={{
                  fontSize: 15,
                  fontWeight: candidate === "Blackburn(R)" ? 700 : 300,
                }}
                key={`legend--${candidate}`}
                x={chartSize}
                y={_scaleY(winprobs[candidate][45])}
              >
                {candidate}
              </text>
            );
          })}
        </svg>
        <svg
          width={chartSize}
          height={chartSize}
          style={{ border: "1px solid black" }}
        >
          <AxisLeft strokeWidth={0} left={margin} scale={_scaleY} />
          <AxisBottom
            strokeWidth={0}
            top={chartSize - margin}
            left={20}
            scale={voteShareScaleL}
            numTicks={10}
          />
          <text x="50" y="50" fontSize={15}>
            Correlation of voteshare and winning probability of Bredesen
          </text>
          <text x="-390" y="15" transform="rotate(-90)" fontSize={15}>
            Senate Candidate Winning Probability Forecast
          </text>
          <text x="-390" y="30" transform="rotate(-90)" fontSize={15}>
            from 08/01/2018-11/06/2018
          </text>
          <text x="100" y="475" fontSize={15}>
            Senate Candidate Predicted Vote Share
          </text>
          <text x="100" y="490" fontSize={15}>
            from 08/01/2018-11/06/2018
          </text>
          {voteshareBredesenL.map((voteshare, i) => {
            var winProb = winprobBredesenL[i];
            return (
              <circle
                key={i}
                cx={voteShareScaleL(voteshare)}
                cy={_scaleY(winProb)}
                r={5}
                style={{ stroke: "rgba(50,50,50)", fill: "none" }}
              />
            );

          })}
        </svg>
      </div>

      <div style={{ display: "flex" }}>
        <svg
          width={chartSize + legendPadding}
          height={chartSize}
          style={{ border: "1px solid black" }}
        >
          <AxisLeft strokeWidth={0} left={margin} scale={_scaleVoteShare} />
          <AxisBottom
            strokeWidth={0}
            top={chartSize - margin}
            left={margin}
            scale={_scaleDate}
            tickValues={testTime}
          />
          <text x="80" y="50" fontSize={20}>
            Predicted Vote Share of Candidates Over Time
          </text>
          <text x="-390" y="15" transform="rotate(-90)" fontSize={15}>
            Senate Candidate Vote Share Forecast
          </text>
          <text x="-390" y="30" transform="rotate(-90)" fontSize={15}>
            from 08/01/2018-11/06/2018
          </text>
          {candidates.map((candidate, i) => {
            return (
              <path
                stroke={candidate === "Blackburn(R)" ? "red" : "blue"}
                strokeWidth={candidate === "Blackburn(R)" ? 3 : 1}
                fill="none"
                key={candidate}
                d={_lineMakerVote(votesharesL[candidate])}
              />
            );
          })}
          {candidates.map((candidate, i) => {
            return (
              <text
                fill={"black"}
                style={{
                  fontSize: 15,
                  fontWeight: candidate === "Blackburn(R)" ? 700 : 300,
                }}
                key={`legend--${candidate}`}
                x={chartSize}
                y={_scaleVoteShare(votesharesL[candidate][70])}
              >
                {candidate}
              </text>
            );
          })}
        </svg>

        <svg
          width={chartSize}
          height={chartSize}
          style={{ border: "1px solid black" }}
        >
          <AxisLeft strokeWidth={0} left={margin} scale={_scaleY} />
          <AxisBottom
            strokeWidth={0}
            top={chartSize - margin}
            left={20}
            scale={voteShareScaleRL}
            numTicks={10}
          />
          <text x="50" y="50" fontSize={15}>
            Correlation of voteshare and winning probability of Blackburn
          </text>
          <text x="-390" y="15" transform="rotate(-90)" fontSize={15}>
            Senate Candidate Winning Probability Forecast
          </text>
          <text x="-390" y="30" transform="rotate(-90)" fontSize={15}>
            from 08/01/2018-11/06/2018
          </text>
          <text x="100" y="475" fontSize={15}>
            Senate Candidate Predicted Vote Share
          </text>
          <text x="100" y="490" fontSize={15}>
            from 08/01/2018-11/06/2018
          </text>
          {voteshareBlackburnL.map((voteshare, i) => {
            var winProb = winprobBlackburnL[i];
            return (
              <circle
                key={i}
                cx={voteShareScaleRL(voteshare)}
                cy={_scaleY(winProb)}
                r={5}
                style={{ stroke: "rgba(50,50,50)", fill: "none" }}
              />
            );

          })}
        </svg>
      </div>
      <p>This is a set of visualizations of the predicted <a href="https://en.wikipedia.org/wiki/2018_United_States_Senate_election_in_Tennessee" target="_blank">2018 Senate
        Election in the State of Tennessee</a>. The predicted data comes from 538, and 538 used their <a href="https://fivethirtyeight.com/methodology/how-fivethirtyeights-house-and-senate-models-work/" target="_blank">
          deluxe and lite models</a> to predict the winning probability of the candidates.
        The deluxe model takes polls, non-polling factors, and expert forecasts into account, while the lite model mainly relies on pooling data.
        In terms of background, Tennessee is a state that Former President Donald Trump by about 27 percentage points in 2016.
        However, the 2018 senate race was viewed as competitive because Phil Bredesen, <a href="https://en.wikipedia.org/wiki/2006_Tennessee_gubernatorial_election" target="_blank">
          a popular former democratic governor</a>, entered the race. In the end, Bredesen lost by 10.8 percentage points.
      </p>
      <p>
        The three questions I would like to investigate are:
        <ol>
          <li>Bredesen lost the election by a double digit margin. Can we truly consider the race to be competitive?</li>
          <li>In terms of the prediction model, what's the relationship between the predicted winning probability and the predicted voteshare?</li>
          <li>Many political pundits mentioned that the appointment of justice Brett Kavanaugh severly affect Bredesen's campaign, is that true?</li>
          <li>What are the significant differences between the lite and deluxe model? Did those differences impact the accuracy of the prediction?</li>
        </ol>
      </p>

      <p>
        <b>For the first question</b>, I plotted the line plots of voteshare vs time and win probability vs time for both the deluxe and the lite model.
        I also plotted a barcode plot, a strip plot, and a histogram for the predicted voteshare. I also plotted a histogram for the predicted win probability.
        I believe seeing the trends over time and the distributions of the voteshare and winning probability data can give me the answer to my first question.
        Based on the visualzations of the deluxe model, we can see that most of Bredesen's winning probabilities were at 30 percent or lower, and
        his winning probability never went higher than Marsha Blackburn. Since the deluxe model considers many aspects in addition to polling, it is not suprising to
        see these results, as TN is one of the most Republican state in the country and our society was extremely polarized at that time. On the other hand, the
        visualzations of the predicted vote share shows that Bredesen was higher than 45 percent for most of the campaign period, this means that his margin between
        Blackburn stayed at around 10 percentage points during most parts of the campaign. There are also cases where Bredesen's predicted vote share was at 47 percent
        or higher, this indicates a race within 6 percentage points. In terms of the lite model, we can even see Bredesen took the lead for a signifanct period of time in both
        winning probability and voteshare, this indicates that the polling at that time was very favorable for Bredesen. Overall, based on the visualzations shown(especially
        the visualzations for the predicted voteshares), and given that former President Trump won the state by over 20 percentage points,
        I would say we can truly consider the race to be competitive. <b>For the second question</b>, I plotted the visualizations of voteshare vs winning probability for both
        the deluxe and the lite model. I saw that all of the plots showed strong positive correlations between the two factors. The higher the predicted voteshare,
        the higher the predited winning probability. However, the correlation for Bredesen in the deluxe model was not as strong as the other plots, a possible cause could be that the
        deluxe model also predicted the winning probability with non-polling factors. Overal, I would say the relationship between the winning proabability and the voteshare are correlated strongly
        and positively.
      </p>

      <p>
        <b>For the third question</b>, the difference of winning probabilities and voteshares between Bredesen and Blackburn widened
        in mid-August and in early-October. In late July, Christine Blasey Ford accused Justice Kavanaugh of sexually assulting her, and
        this incident started to get public attention in mid-August, and that was the first dip in Bredesen's winning chance. Also in early August,
        Marsha Blackburn started to <a href="https://www.tennessean.com/story/news/politics/tn-elections/2018/08/07/tennessee-senate-race-marsha-blackburn-trumpets-donald-trump-endorsement-new-ad-phil-bredesen/923030002/">
          highlight Donald Trump's endorsement in TV ads</a>. In early-October, Bredesen announced his support to Justice Kavanaugh, and this action alienated many Democratic voters.
        Based on what I saw on the visualizations of winning probability over time and voteshare over time, there were significant changes in trend during these time periods.
        For example, the deluxe model showed one dip in mid-August and one dip in early-October for Bredesen. For the lite model, there weren't significant changes in mid-August, the race was projected to be
        in a dead heat. However, Bredesen's predictions crashed in early-october. Based on what I saw on the visualizations, Bredesen's support on Kavanaugh took a big effect in affecting
        his chance of winning. Thus, I would say the nomination of Brett Kavanaugh had an effect on Bredesen's chance of winning, and that effect was severe and negative. <b>For the fourth question</b>, we can see from the trend visualizations that both Bredesen's winning probability and voteshare never led Blackburn over the campaign season. On the other hand, Bredesen took a slight lead for about a month
        in the lite model. Both model captured the crash of Bredesen's campaign, and predicted the correct winner. Thus, I would say the type of model didn't affect the accuracy in this case.
        However, opinion polling can be biased and it has margin of error. Even though Bredesen is leading in the polls, other factors such as polarization and political culture could still push
        voters who crossed over their supports to Bredesen ended up voting for Blackburn. Thus, I would trust the deluxe model more, as it takes more non-polling factors into
        account and is more possible to give out an unbiased prediction.

      </p>

    </div>
  );
}
export default App;
