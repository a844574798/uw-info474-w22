import React, { useState } from "react";
import { scaleLinear, scaleBand, timeParse, scaleTime, extent, line, symbol, csv } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { uniq } from "lodash";
import senate2018 from "./2018_senate_seat_forecasets_538"
import * as d3 from "d3";


function App() {
  const indiana = senate2018.filter(forecast => (forecast.state === "IN") && (forecast.model === "deluxe"));
  const indianaLite = senate2018.filter(forecast => (forecast.state === "IN") && (forecast.model === "lite"));
  console.log(indianaLite);
  const indianaClassic = senate2018.filter(forecast => (forecast.state === "IN") && (forecast.model === "classic"));
  const wvDeluxe = senate2018.filter(forecast => (forecast.state === "WV") && (forecast.model === "deluxe"));
  const wvLite = senate2018.filter(forecast => (forecast.state === "WV") && (forecast.model === "lite"));
  const wvClassic = senate2018.filter(forecast => (forecast.state === "WV") && (forecast.model === "classic"));
  const voteshareManchinDeluxe = [];
  const voteshareMorriseyDeluxe = [];
  const winprobManchinDeluxe = [];
  const winprobMorriseyDeluxe = [];
  const voteshareManchinClassic = [];
  const voteshareMorriseyClassic = [];
  const winprobManchinClassic = [];
  const winprobMorriseyClassic = [];
  const voteshareManchinLite = [];
  const voteshareMorriseyLite = [];
  const winprobManchinLite = [];
  const winprobMorriseyLite = [];
  const voteshareDonnelly = [];
  const voteshareBraun = [];
  const winprobDonnelly = [];
  const winprobBraun = [];
  const voteshareDonnellyL = [];
  const voteshareBraunL = [];
  const winprobDonnellyL = [];
  const winprobBraunL = [];
  const voteshareDonnellyClassic = [];
  const voteshareBraunClassic = [];
  const winprobDonnellyClassic = [];
  const winprobBraunClassic = [];
  const dates = [];
  const days = ["2018-08-01", "2018-09-01", "2018-10-01", "2018-11-01"];
  const testTime = [];
  const parseTime = timeParse("%Y-%m-%d");
  days.forEach((day) => testTime.push(parseTime(day)));

  indiana.forEach((forecast) => {
    if (forecast.candidate === "Joe Donnelly") {
      voteshareDonnelly.push(forecast.voteshare);
      winprobDonnelly.push(forecast.win_probability);
      let time = forecast.forecastdate;
      dates.push(parseTime(time));
    }

    if (forecast.candidate === "Mike Braun") {
      voteshareBraun.push(forecast.voteshare);
      winprobBraun.push(forecast.win_probability);
    }
  });

  wvDeluxe.forEach((forecast) => {
    if (forecast.candidate === "Joe Manchin III") {
      voteshareManchinDeluxe.push(forecast.voteshare);
      winprobManchinDeluxe.push(forecast.win_probability);
    }

    if (forecast.candidate === "Patrick Morrisey") {
      voteshareMorriseyDeluxe.push(forecast.voteshare);
      winprobMorriseyDeluxe.push(forecast.win_probability);
    }
  });

  wvClassic.forEach((forecast) => {
    if (forecast.candidate === "Joe Manchin III") {
      voteshareManchinClassic.push(forecast.voteshare);
      winprobManchinClassic.push(forecast.win_probability);
    }

    if (forecast.candidate === "Patrick Morrisey") {
      voteshareMorriseyClassic.push(forecast.voteshare);
      winprobMorriseyClassic.push(forecast.win_probability);
    }
  });

  wvLite.forEach((forecast) => {
    if (forecast.candidate === "Joe Manchin III") {
      voteshareManchinLite.push(forecast.voteshare);
      winprobManchinLite.push(forecast.win_probability);
    }

    if (forecast.candidate === "Patrick Morrisey") {
      voteshareMorriseyLite.push(forecast.voteshare);
      winprobMorriseyLite.push(forecast.win_probability);
    }
  });

  indianaLite.forEach((forecast) => {
    if (forecast.candidate === "Joe Donnelly") {
      voteshareDonnellyL.push(forecast.voteshare);
      winprobDonnellyL.push(forecast.win_probability);
    }

    if (forecast.candidate === "Mike Braun") {
      voteshareBraunL.push(forecast.voteshare);
      winprobBraunL.push(forecast.win_probability);
    }
  });

  indianaClassic.forEach((forecast) => {
    if (forecast.candidate === "Joe Donnelly") {
      voteshareDonnellyClassic.push(forecast.voteshare);
      winprobDonnellyClassic.push(forecast.win_probability);
    }

    if (forecast.candidate === "Mike Braun") {
      voteshareBraunClassic.push(forecast.voteshare);
      winprobBraunClassic.push(forecast.win_probability);
    }
  });


  const voteshares = { "Donnelly(D)": voteshareDonnelly, "Braun(R)": voteshareBraun, "Manchin(D)": voteshareManchinDeluxe, "Morrisey(R)": voteshareMorriseyDeluxe };
  const votesharesClassic = { "Donnelly(D)": voteshareDonnellyClassic, "Braun(R)": voteshareBraunClassic, "Manchin(D)": voteshareManchinClassic, "Morrisey(R)": voteshareMorriseyClassic };
  const votesharesL = { "Donnelly(D)": voteshareDonnellyL, "Braun(R)": voteshareBraunL, "Manchin(D)": voteshareManchinDeluxe, "Morrisey(R)": voteshareMorriseyDeluxe };
  const winprobs = { "Donnelly(D)": winprobDonnelly, "Braun(R)": winprobBraun, "Manchin(D)": winprobManchinDeluxe, "Morrisey(R)": winprobMorriseyDeluxe };
  const winprobsClassic = { "Donnelly(D)": winprobDonnellyClassic, "Braun(R)": winprobBraunClassic, "Manchin(D)": winprobManchinClassic, "Morrisey(R)": winprobMorriseyClassic };
  const winprobsLite = { "Donnelly(D)": winprobDonnellyL, "Braun(R)": winprobBraunL, "Manchin(D)": winprobManchinLite, "Morrisey(R)": winprobMorriseyLite };
  const candidatesByState = { "Indiana": ["Donnelly(D)", "Braun(R)"], "West Virginia": ["Manchin(D)", "Morrisey(R)"] }
  const modelWinProbs = { "deluxe": winprobDonnelly, "classic": winprobDonnellyClassic, "lite": winprobDonnellyL };
  const modelWinProbs2 = { "deluxe": winprobManchinDeluxe, "classic": winprobManchinClassic, "lite": winprobManchinLite };
  const modelWinProbsTotal = { "Deluxe": winprobs, "Classic": winprobsClassic, "Lite": winprobsLite };
  const modelVoteShareTotal = { "Deluxe": voteshares, "Classic": votesharesClassic, "Lite": votesharesL };


  const votesharesDemDeluxe = { "Indiana": voteshareDonnelly, "West Virginia": voteshareManchinDeluxe };
  const votesharesDemClassic = { "Indiana": voteshareDonnellyClassic, "West Virginia": voteshareManchinClassic };
  const votesharesDemLite = { "Indiana": voteshareDonnellyL, "West Virginia": voteshareManchinLite };
  const winprobsDemDeluxe = { "Indiana": winprobDonnelly, "West Virginia": winprobManchinDeluxe };
  const winprobsDemClassic = { "Indiana": winprobDonnellyClassic, "West Virginia": winprobManchinClassic };
  const winprobsDemLite = { "Indiana": winprobDonnellyL, "West Virginia": winprobManchinLite };
  const votesharesGopDeluxe = { "Indiana": voteshareBraun, "West Virginia": voteshareMorriseyDeluxe };
  const votesharesGopClassic = { "Indiana": voteshareBraunClassic, "West Virginia": voteshareMorriseyClassic };
  const votesharesGopLite = { "Indiana": voteshareBraunL, "West Virginia": voteshareMorriseyLite };
  const winprobsGopDeluxe = { "Indiana": winprobBraun, "West Virginia": winprobMorriseyDeluxe };
  const winprobsGopClassic = { "Indiana": winprobBraunClassic, "West Virginia": winprobMorriseyClassic };
  const winprobsGopLite = { "Indiana": winprobBraunL, "West Virginia": winprobMorriseyLite };

  const voteshareDem = { "Deluxe": votesharesDemDeluxe, "Classic": votesharesDemClassic, "Lite": votesharesDemLite };
  const voteshareGop = { "Deluxe": votesharesGopDeluxe, "Classic": votesharesGopClassic, "Lite": votesharesGopLite };
  const winprobsDem = { "Deluxe": winprobsDemDeluxe, "Classic": winprobsDemClassic, "Lite": winprobsDemLite };
  const winprobsGop = { "Deluxe": winprobsGopDeluxe, "Classic": winprobsGopClassic, "Lite": winprobsGopLite };

  const chartSize = 500;
  const margin = 70;
  const legendPadding = 100;
  const _extent = extent(winprobManchinDeluxe);
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

  const _lineMaker = line()
    .x((d, i) => {
      return _scaleLine(i);
    })
    .y((d) => {
      return _scaleY(d);
    });


  const voteShareChartWidth = 500;
  const voteShareMargin = 70;

  var minVoteShareWVD = d3.min(voteshareManchinDeluxe);
  var maxVoteShareWVD = d3.max(voteshareManchinDeluxe);
  var minVoteShareWVR = d3.min(voteshareMorriseyDeluxe);
  var maxVoteShareWVR = d3.max(voteshareMorriseyDeluxe);


  const voteshareScaleWVD = scaleLinear()
    .domain([minVoteShareWVD - 0.1, maxVoteShareWVD + 0.4])
    .range([voteShareMargin, voteShareChartWidth - voteShareMargin]);

  const voteshareScaleWVR = scaleLinear()
    .domain([minVoteShareWVR - 1, maxVoteShareWVR])
    .range([voteShareMargin, voteShareChartWidth - voteShareMargin]);

  var minVoteShareIND = d3.min(voteshareDonnelly);
  var maxVoteShareIND = d3.max(voteshareDonnelly);
  var minVoteShareINR = d3.min(voteshareBraun);
  var maxVoteShareINR = d3.max(voteshareBraun);

  const voteshareScaleIND = scaleLinear()
    .domain([minVoteShareIND, maxVoteShareIND])
    .range([voteShareMargin, voteShareChartWidth - voteShareMargin]);

  const voteshareScaleINR = scaleLinear()
    .domain([minVoteShareINR - 1, maxVoteShareINR])
    .range([voteShareMargin, voteShareChartWidth - voteShareMargin]);

  const scaleDem = {"Indiana": voteshareScaleIND, "West Virginia": voteshareScaleWVD};
  const scaleGop = {"Indiana": voteshareScaleINR, "West Virginia": voteshareScaleWVR};


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



  const [selectedModel, setSelectedModel] = useState(["deluxe"]);
  const [selectedModel2, setSelectedModel2] = useState(["deluxe"]);
  const models = ["deluxe", "classic", "lite"];
  const colors = { "deluxe": "gold", "classic": "silver", "lite": "black" };
  const [selectState, setSelectedState] = useState("Indiana");
  const [chosenModel, setChosenModel] = useState("Deluxe");

  const handleSelectedState = (event) => {
    let newValue = event.target.value;

    setSelectedState(newValue);
  }

  const handleChosenModel = (event) => {
    let newValue = event.target.value;

    setChosenModel(newValue);
  }


  return (
    <div style={{ margin: 20 }}>
      <h1>2018 Senate Forecast in the State of Indiana and West Virginia</h1>
      <h2>INFO 474 Final Project</h2>

      <p>Select a State and a Prediction Model to Investigate</p>
      <div>
        <text>Pick a State</text>
        <select onChange={handleSelectedState}>
          <option id="IN" onClick={handleSelectedState}>Indiana</option>
          <option id="WV" onClick={handleSelectedState}>West Virginia</option>
        </select>
        
        <text>    Pick a Model</text>
        <select onChange={handleChosenModel}>
          <option id="De" onClick={handleChosenModel}>Deluxe</option>
          <option id="Cl" onClick={handleChosenModel}>Classic</option>
          <option id="Li" onClick={handleChosenModel}>Lite</option>
        </select>
      </div>


      <h3>Visualiztions using data predicted by the {chosenModel} model:</h3>
      <h3>You are now looking at the state of {selectState}</h3>
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
          {candidatesByState[selectState].map((candidate, i) => {
            return (
              <path
                stroke={candidate === "Braun(R)" || candidate === "Morrisey(R)" ? "red" : "blue"}
                strokeWidth={candidate === "Braun(R)" || candidate === "Manchin(D)" ? 3 : 1}
                fill="none"
                key={candidate}
                d={_lineMaker(modelWinProbsTotal[chosenModel][candidate])}
              />
            );
          })}
          {candidatesByState[selectState].map((candidate, i) => {
            return (
              <text
                fill={"black"}
                style={{
                  fontSize: 15,
                  fontWeight: candidate === "Braun(R)" || candidate === "Manchin(D)" ? 700 : 300,
                }}
                key={`legend--${candidate}`}
                x={chartSize}
                y={_scaleY(modelWinProbsTotal[chosenModel][candidate][75])}
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
            scale={scaleDem[selectState]}
            numTicks={10}
          />
          <text x="7" y="40" fontSize={15}>
            Correlation of voteshare and winning probability of Democratic Candidate
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
          {voteshareDem[chosenModel][selectState].map((voteshare, i) => {
            var winProb = winprobsDem[chosenModel][selectState][i];
            const scaleD = scaleDem[selectState]
            return (
              <circle
                key={i}
                cx={scaleD(voteshare)}
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
          {candidatesByState[selectState].map((candidate, i) => {
            return (
              <path
                stroke={candidate === "Braun(R)" || candidate === "Morrisey(R)" ? "red" : "blue"}
                strokeWidth={candidate === "Braun(R)" || candidate === "Manchin(D)" ? 3 : 1}
                fill="none"
                key={candidate}
                d={_lineMakerVote(modelVoteShareTotal[chosenModel][candidate])}
              />
            );
          })}

          {candidatesByState[selectState].map((candidate, i) => {
            return (
              <text
                fill={"black"}
                style={{
                  fontSize: 15,
                  fontWeight: candidate === "Braun(R)" || candidate === "Manchin(D)" ? 700 : 300,
                }}
                key={`legend--${candidate}`}
                x={chartSize}
                y={_scaleVoteShare(modelVoteShareTotal[chosenModel][candidate][45])}
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
            scale={scaleGop[selectState]}
            numTicks={10}
          />
          <text x="7" y="40" fontSize={15}>
            Correlation of voteshare and winning probability of Republican Candidate
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
          {voteshareGop[chosenModel][selectState].map((voteshare, i) => {
            var winProb = winprobsGop[chosenModel][selectState][i];
            const scaleR = scaleGop[selectState];
            return (
              <circle
                key={i}
                cx={scaleR(voteshare)}
                cy={_scaleY(winProb)}
                r={5}
                style={{ stroke: "rgba(50,50,50)", fill: "none" }}
              />
            );

          })}
        </svg>
      </div>

      <h3>Joe Donnelly's Predicted Winning Probabilities Based on Different Model</h3>
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
            Predicted Winning Probability of Donnelly Over Time Based on Different Models
          </text>
          <text x="-390" y="15" transform="rotate(-90)" fontSize={15}>
            Joe Donnelly's Winning Probability Forecast
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


      <h3>Joe Manchin's Predicted Winning Probabilities Based on Different Model</h3>
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
                checked={selectedModel2.indexOf(model) > -1}
                onChange={() => {
                  if (selectedModel2.indexOf(model) === -1) {
                    const updatedModels = [...selectedModel2, model]
                    setSelectedModel2(updatedModels);
                  } else {
                    setSelectedModel2(
                      selectedModel2.slice(0).filter((_model) => {
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
            Predicted Winning Probability of Manchin Over Time Based on Different Models
          </text>
          <text x="-390" y="15" transform="rotate(-90)" fontSize={15}>
            Joe Manchin's Winning Probability Forecast
          </text>
          <text x="-390" y="30" transform="rotate(-90)" fontSize={15}>
            from 08/01/2018-11/06/2018
          </text>
          {selectedModel2.map((model, i) => {
            return (
              <path
                stroke={colors[model]}
                strokeWidth={2}
                fill="none"
                key={model}
                d={_lineMaker(modelWinProbs2[model])}
              />
            );
          })}
          {selectedModel2.map((model, i) => {
            return (
              <text
                fill={colors[model]}
                style={{
                  fontSize: 15
                }}
                key={`legend--${model}`}
                x={chartSize + 50}
                y={_scaleY(modelWinProbs2[model][90])}
              >
                {model}
              </text>
            );
          })}
        </svg>
      </div>

      <p>
        Github Repository Link: <a href="https://github.com/a844574798/uw-info474-w22.git" target="_blank">https://github.com/a844574798/uw-info474-w22.git</a>
      </p>
    </div>
  );
}
export default App;
