import { scaleLinear, scaleBand, timeParse, scaleTime, extent, line, symbol, csv } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { uniq } from "lodash";
import senate2018 from "./2018_senate_seat_forecasets_538"

function App() {
  const tennessee = senate2018.filter(forecast => (forecast.state === "TN") && (forecast.model === "deluxe"));
  const voteshareBredesen = [];
  const voteshareBlackburn = [];
  const voteshareOther = [];
  const winprobBredesen = [];
  const winprobBlackburn = [];
  const winprobOther = [];
  const dates = [];
  const days = ["2018-08-01", "2018-09-01", "2018-10-01", "2018-11-01"];
  const testTime = [];
  const parseTime = timeParse("%Y-%m-%d");
  days.forEach((day) => testTime.push(parseTime(day)));
  console.log(testTime);

  tennessee.forEach((forecast) =>{
    if(forecast.candidate === "Phil Bredesen"){
      voteshareBredesen.push(forecast.voteshare);
      winprobBredesen.push(forecast.win_probability);
      let time = forecast.forecastdate;
      dates.push(parseTime(time));
    } 
    
    if (forecast.candidate === "Marsha Blackburn"){
      voteshareBlackburn.push(forecast.voteshare);
      winprobBlackburn.push(forecast.win_probability);
    }
    if (forecast.candidate === "Others"){
      voteshareOther.push(forecast.voteshare);
      winprobOther.push(forecast.win_probability);
    }
  });

  const absDifference = (arr1, arr2) => {
    const res = [];
    for(let i = 0; i < arr1.length; i++){
       const el = Math.abs((arr1[i] || 0) - (arr2[i] || 0));
       res[i] = el;
    };
    return res;
 };

  const voteMargin = absDifference(voteshareBredesen, voteshareBlackburn);
  const voteshares = {"Bredesen(D)":voteshareBredesen, "Blackburn(R)":voteshareBlackburn, "Others":voteshareOther};
  const winprobs = {"Bredesen(D)":winprobBredesen, "Blackburn(R)":winprobBlackburn};
  const candidates = ["Bredesen(D)", "Blackburn(R)"];
  const months = ["August", "September", "October", "November"];

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

  return (
    <div style={{ margin: 20 }}>
      <h1>2018 Senate Forecast in the State of Tennessee</h1>

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
      </div>
      <p>This is a visualization of the Predicted Winning Probability of the <a href = "https://en.wikipedia.org/wiki/2018_United_States_Senate_election_in_Tennessee" target="_blank">2018 Senate 
        Election in the State of Tennessee</a>. The predicted data comes from 538, and 538 used their <a href = "https://fivethirtyeight.com/methodology/how-fivethirtyeights-house-and-senate-models-work/" target="_blank">
          deluxe model</a> to predict the winning probability of the candidates. 
          I chose the data predicted by the deluxe model because the model takes polls, non-polling factors, and expert forecasts into account.
          Since this model considers more situations and aspects, I believe it is more likely to give us an unbiased and accurate prediction. In terms of accuracy, 
          Marsha Blackburn ended up winning the election. Based on the visualization, the model predicted it accurately.
      </p>
      <p>
        Background Story: Tennessee is a state that Former President Donald Trump by about 27 percentage points in 2016. 
        However, the 2018 senate race was hyper competitive because Phil Bredesen, <a href = "https://en.wikipedia.org/wiki/2006_Tennessee_gubernatorial_election" target = "_blank">
        a popular former democratic governor</a>, entered the race.
        Even though there were multiple candidates, the front-running candidates were congresswoman Marsha Blackburn(R) and Phil Bredesen(D).
        Despite the result that Bredesen lost by 10 percentage points, the race was expected to be close during certain periods of time
        where Bredesen was leading in polls and the national environment favored the Democrats in 2018. Nevertheless, 
        many political experts and media thought that the nomination of Brett Kavanaugh as Supreme Court Justice 
        and other incidents happened during September and October cost Bredesen the election.
      </p>
      <p>
        I chose to design my visualization into a line plot because I would like to observe the trend of the election and whether events such as the Kavanaugh trial
        negatively impacted Bredesen's chance of winning the election. Thus, it would be better to choose a graph that shows changes over time.
        The variables I'm focusing on for my dataset is the predicted winning probability and the forecast date as the winning probabilities were predicted using a well-developed model.
        Comparing to the voteshare variable, the winning probability variable is easier for us to observe even a very slight change happened to the campaign.
        Moreover, I put the line in red to represent Blackburn(R) and the other line in blue to represent Bredesen(D) because these were the theme color of their
        corresponding parties. In terms of scale, the x-axis is time from August to November. At first, I tried to put every forecast dates as tickles. 
        However, that proved to be overcrowded, and thus I instead used the name of 4 months as the domains. On the other hand, The y-axis is the winning probability (0 to 1.0).
        In terms of legend, I labeled the lines with the candidates' names and their corresponding parties. In this way people with minimal background knowledge can 
        understand what the visualization is about. Also, I made the legend of Blackburn bold to reflect that she was the ultimate winner, I also put more weight on the red line to emphasize that.
      </p>

      <p>
        As we can see on the visualization, the difference of winning probabilities between Bredesen and Blackburn widened
        in mid-August and in early-October. In late July, Christine Blasey Ford accused Justice Kavanaugh of sexually assulting her, and 
        this incident started to get public attention in mid-August, and that was the first dip in Bredesen's winning chance. Also in early August, 
        Marsha Blackburn started to <a href="https://www.tennessean.com/story/news/politics/tn-elections/2018/08/07/tennessee-senate-race-marsha-blackburn-trumpets-donald-trump-endorsement-new-ad-phil-bredesen/923030002/">
           highlight Donald Trump's endorsement in TV ads</a>. Later in late-August and 
        early-September, the Senate Judiciary Committee held public hearings and trials which the public believed that the Democrats performed 
        poorly and therefore energized the Republican voters, and we could see on the plot that Bredesen's winning probability didn't recover 
        during that time period. In early October, Bredesen announced his support to Justice Kavanaugh, and this action alienated some Democratic voters
        and his support started to continuously decline as showned in multiple polls. On the visualization, we can see that there were noticable
        changes in winning probability on the time periods mentioned in the previous part of this paragraph. In mid-August, there was
        a huge dip in Bredesen's winning probability, and his winning probability was hovering around 30% and bounced back to 40%
        in late September. The event that cause this bounce back has not yet been identified, and it would be interesting to find it out.
        Later in early October, Bredesen's winning probability took another dip and kept crashing until the election day. Based on the trends and patterns noticed,
        I can say that the nomination of Brett Kavanaugh as Supreme Court Justice do play a role in hindering Bredesen's 
        chance of being elected.
      </p>

      <p>
        Github Repository Link: <a href="https://github.com/a844574798/uw-info474-w22.git" target="_blank">https://github.com/a844574798/uw-info474-w22.git</a>
      </p>
    </div>
  );
}
export default App;
