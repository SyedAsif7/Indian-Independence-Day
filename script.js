// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create map instance
var chart = am4core.create("chartdiv", am4maps.MapChart);

// Set map definition
chart.geodata = am4geodata_india2019High;

// Create map polygon series
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

// Make map load polygon data (state shapes and names) from GeoJSON
polygonSeries.useGeodata = true;

// Configure series
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{name}";
polygonTemplate.fill = am4core.color("#f0f0f0");  // Light gray fill
polygonTemplate.stroke = am4core.color("#138808");  // Green border
polygonTemplate.strokeWidth = 0.5;

// Create hover state and set alternative fill color
var hs = polygonTemplate.states.create("hover");
hs.properties.fill = am4core.color("#FF9933");  // Orange for hover state

// Remove Antarctica
polygonSeries.exclude = ["AQ"];

// Responsive behavior
chart.responsive.enabled = true;
chart.responsive.rules.push({
  relevant: function(target) {
    if (target.pixelWidth <= 400) {
      return true;
    }
    return false;
  },
  state: function(target, stateId) {
    if (target instanceof am4charts.Chart) {
      var state = target.states.create(stateId);
      state.properties.paddingTop = 0;
      state.properties.paddingRight = 0;
      state.properties.paddingBottom = 0;
      state.properties.paddingLeft = 0;
      return state;
    }
    return null;
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const anthem = document.getElementById('anthem');
    const lyricsDiv = document.getElementById('lyrics');
    const freedomStruggleDiv = document.getElementById('freedom-struggle');
    const playButton = document.getElementById('playButton');

    const lyrics = [
        "Jana Gana Mana Adhinayaka Jaya He",
        "Bharata Bhagya Vidhata",
        "Punjab Sindhu Gujarat Maratha",
        "Dravida Utkala Banga",
        "Vindhya Himachala Yamuna Ganga",
        "Uchchala Jaladhi Taranga",
        "Tava Shubha Name Jage",
        "Tava Shubha Ashisha Mage",
        "Gahe Tava Jaya Gatha",
        "Jana Gana Mangala Dayaka Jaya He",
        "Bharata Bhagya Vidhata",
        "Jaya He, Jaya He, Jaya He",
        "Jaya Jaya Jaya Jaya He"
    ];

    const freedomStruggleEvents = [
        "1857: First War of Independence",
        "1885: Indian National Congress formed",
        "1906: Partition of Bengal",
        "1915: Gandhi returns to India",
        "1919: Jallianwala Bagh massacre",
        "1920: Non-Cooperation Movement",
        "1930: Salt March",
        "1935: Government of India Act",
        "1942: Quit India Movement",
        "1946: Cabinet Mission Plan",
        "1947: Partition and Independence",
        "15 August 1947: India gains freedom",
        "26 January 1950: India becomes a Republic"
    ];

    let currentLyricIndex = 0;
    let currentEventIndex = 0;

    playButton.addEventListener('click', () => {
        anthem.play();
    });

    anthem.addEventListener('play', startAnimation);
    anthem.addEventListener('ended', endAnimation);

    function startAnimation() {
        const duration = 70000;
        const steps = 100;
        const stepDuration = duration / steps;

        let step = 0;
        const interval = setInterval(() => {
            const progress = step / steps;

            polygonTemplate.stroke = am4core.color(
                interpolateColor("#138808", "#FF9933", progress)
            );

            if (step % Math.ceil(steps / lyrics.length) === 0 && currentLyricIndex < lyrics.length) {
                lyricsDiv.textContent = lyrics[currentLyricIndex];
                currentLyricIndex++;
            }

            if (step % Math.ceil(steps / freedomStruggleEvents.length) === 0 && currentEventIndex < freedomStruggleEvents.length) {
                freedomStruggleDiv.textContent = freedomStruggleEvents[currentEventIndex];
                currentEventIndex++;
            }

            step++;
            if (step > steps) {
                clearInterval(interval);
            }
        }, stepDuration);
    }

    function endAnimation() {
        polygonTemplate.stroke = am4core.color("#FF9933");
        lyricsDiv.textContent = "Jai Hind";
        freedomStruggleDiv.textContent = "Happy Independence Day";
    }

    function interpolateColor(color1, color2, factor) {
        let result = color1.slice(1).match(/.{2}/g).map((hex, i) => {
            return Math.round(
                parseInt(hex, 16) + factor * (parseInt(color2.slice(1).match(/.{2}/g)[i], 16) - parseInt(hex, 16))
            ).toString(16).padStart(2, '0');
        });
        return '#' + result.join('');
    }
});
