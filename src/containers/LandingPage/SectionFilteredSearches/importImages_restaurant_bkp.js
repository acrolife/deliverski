/* 
 * Dynamically import static assets
 */

import restaurantsData from '../../../assets/data/restaurants'

// for (const [index, imageName] of restaurantsFiltered.map(e => e.imageName).entries()) {
//   let path
//   import path from `../../../assets/restaurantsImages/${imageName}.jpg`
//   restaurantsFiltered[index].imagePath = path
// }

// Src: https://stackoverflow.com/questions/42118296/dynamically-import-images-from-a-directory-using-webpack
const importAll = (r) => r.keys().map(r)

let restaurantImagePaths = importAll(require.context('../../../assets/restaurantsImages/', false, /\.(jpg)$/));
// false, /\.(png|jpe?g|svg)$/));

const pathStringKey = "static/media/"
restaurantImagePaths = restaurantImagePaths.map(e => e.default).filter(e => e.includes(pathStringKey))

const restaurantNameToPath = restaurantImagePaths.map(e => 
    Object.fromEntries(
        [
            [ "name", e.split(pathStringKey)[1].split('.')[0]], 
            [ "path", e]
        ]
    ))
    
// DEV DEBUG
// console.log(restaurantNameToPath)


/* 
 * Manually import static assets // Not needed anymore
 */

/*
// Restaurants 1600
import restaurant_1600_labuche from '../../../assets/restaurantsImages/restaurant_1600_labuche.jpg'
import restaurant_1600_lebistrotdedodo from '../../../assets/restaurantsImages/restaurant_1600_lebistrotdedodo.jpg'
import restaurant_1600_thefrenchtouch from '../../../assets/restaurantsImages/restaurant_1600_thefrenchtouch.jpg'
import restaurant_1600_lesnowdwich from '../../../assets/restaurantsImages/restaurant_1600_lesnowdwich.jpg'
import restaurant_1600_lepanoramic from '../../../assets/restaurantsImages/restaurant_1600_lepanoramic.jpg'
import restaurant_1600_legeneux from '../../../assets/restaurantsImages/restaurant_1600_legeneux.jpg'
import restaurant_1600_sherpa from '../../../assets/restaurantsImages/restaurant_1600_sherpa.jpg'

// Restaurants 1800
import restaurant_1800_mamiecrepe from '../../../assets/restaurantsImages/restaurant_1800_mamiecrepe.jpg'
import restaurant_1800_mountaincafe from '../../../assets/restaurantsImages/restaurant_1800_mountaincafe.jpg'
import restaurant_1800_lafriteennord from '../../../assets/restaurantsImages/restaurant_1800_lafriteennord.jpg'
import restaurant_1800_lapateapizz from '../../../assets/restaurantsImages/restaurant_1800_lapateapizz.jpg'
import restaurant_1800_sherpa from '../../../assets/restaurantsImages/restaurant_1800_sherpa.jpg'
import restaurant_1800_spar from '../../../assets/restaurantsImages/restaurant_1800_spar.jpg'
import restaurant_1800_lerefugedujambon from '../../../assets/restaurantsImages/restaurant_1800_lerefugedujambon.jpg'
import restaurant_1800_chezclarisse from '../../../assets/restaurantsImages/restaurant_1800_chezclarisse.jpg'
import restaurant_1800_aupalaisfin from '../../../assets/restaurantsImages/restaurant_1800_aupalaisfin.jpg'
import restaurant_1800_lagrangeberger from '../../../assets/restaurantsImages/restaurant_1800_lagrangeberger.jpg'
import restaurant_1800_letrapoun from '../../../assets/restaurantsImages/restaurant_1800_letrapoun.jpg'
import restaurant_1800_lesconvives from '../../../assets/restaurantsImages/restaurant_1800_lesconvives.jpg'
import restaurant_1800_casamia from '../../../assets/restaurantsImages/restaurant_1800_casamia.jpg'
import restaurant_1800_leptipanier from '../../../assets/restaurantsImages/restaurant_1800_leptipanier.jpg'
import restaurant_1800_alpinesaveur from '../../../assets/restaurantsImages/restaurant_1800_alpinesaveur.jpg'
import restaurant_1800_lepetitzinc_belambra from '../../../assets/restaurantsImages/restaurant_1800_lepetitzinc_belambra.jpg'
import restaurant_1800_lelaurus from '../../../assets/restaurantsImages/restaurant_1800_lelaurus.jpg'
import restaurant_1800_ramenetabraise from '../../../assets/restaurantsImages/restaurant_1800_ramenetabraise.jpg'
import restaurant_1800_qualitypizza from '../../../assets/restaurantsImages/restaurant_1800_qualitypizza.jpg'
import restaurant_1800_pizzattitude from '../../../assets/restaurantsImages/restaurant_1800_pizzattitude.jpg'
import restaurant_1800_iceberg from '../../../assets/restaurantsImages/restaurant_1800_iceberg.jpg'
import restaurant_1800_dreamspot from '../../../assets/restaurantsImages/restaurant_1800_dreamspot.jpg'
import restaurant_1800_chantel_lepetitmarche from '../../../assets/restaurantsImages/restaurant_1800_chantel_lepetitmarche.jpg'
import restaurant_1800_chantel_vogayoga from '../../../assets/restaurantsImages/restaurant_1800_chantel_vogayoga.jpg'

// Restaurants 1950
import restaurant_1950_brasserie1950 from '../../../assets/restaurantsImages/restaurant_1950_brasserie1950.jpg'
import restaurant_1950_hemingways from '../../../assets/restaurantsImages/restaurant_1950_hemingways.jpg'
import restaurant_1950_latabledeslys from '../../../assets/restaurantsImages/restaurant_1950_latabledeslys.jpg'
import restaurant_1950_lavacherouge from '../../../assets/restaurantsImages/restaurant_1950_lavacherouge.jpg'
import restaurant_1950_lemazot from '../../../assets/restaurantsImages/restaurant_1950_lemazot.jpg'
import restaurant_1950_leperceneige from '../../../assets/restaurantsImages/restaurant_1950_leperceneige.jpg'
import restaurant_1950_lesbellespintes from '../../../assets/restaurantsImages/restaurant_1950_lesbellespintes.jpg'
import restaurant_1950_melissnack from '../../../assets/restaurantsImages/restaurant_1950_melissnack.jpg'
import restaurant_1950_nonnalisa from '../../../assets/restaurantsImages/restaurant_1950_nonnalisa.jpg'

// Restaurants 2000
import restaurant_2000_auschuss from '../../../assets/restaurantsImages/restaurant_2000_auschuss.jpg'
import restaurant_2000_lekilimandjaro from '../../../assets/restaurantsImages/restaurant_2000_lekilimandjaro.jpg'
import restaurant_2000_leredrock from '../../../assets/restaurantsImages/restaurant_2000_leredrock.jpg'
import restaurant_2000_lesavoy from '../../../assets/restaurantsImages/restaurant_2000_lesavoy.jpg'
import restaurant_2000_papapizza from '../../../assets/restaurantsImages/restaurant_2000_papapizza.jpg'

let restaurantPaths = [
    {
        path: restaurant_1600_labuche,
        name: "restaurant_1600_labuche"
    },
    {
        path: restaurant_1600_lebistrotdedodo,
        name: "restaurant_1600_lebistrotdedodo"
    },
    {
        path: restaurant_1600_thefrenchtouch,
        name: "restaurant_1600_thefrenchtouch"
    },
    {
        path: restaurant_1600_legeneux,
        name: "restaurant_1600_legeneux"
    },
    {
        path: restaurant_1600_lepanoramic,
        name: "restaurant_1600_lepanoramic"
    },
    {
        path: restaurant_1600_lesnowdwich,
        name: "restaurant_1600_lesnowdwich"
    },
    {
        path: restaurant_1600_sherpa,
        name: "restaurant_1600_sherpa"
    },
    {
        path: restaurant_1800_alpinesaveur,
        name: "restaurant_1800_alpinesaveur"
    },
    {
        path: restaurant_1800_aupalaisfin,
        name: "restaurant_1800_aupalaisfin"
    },
    {
        path: restaurant_1800_casamia,
        name: "restaurant_1800_casamia"
    },
    {
        path: restaurant_1800_lesconvives,
        name: "restaurant_1800_lesconvives"
    },    
    {
        path: restaurant_1800_chantel_lepetitmarche,
        name: "restaurant_1800_chantel_lepetitmarche"
    },
    {
        path: restaurant_1800_chantel_vogayoga,
        name: "restaurant_1800_chantel_vogayoga"
    },
    {
        path: restaurant_1800_chezclarisse,
        name: "restaurant_1800_chezclarisse"
    },
    {
        path: restaurant_1800_dreamspot,
        name: "restaurant_1800_dreamspot"
    },
    {
        path: restaurant_1800_iceberg,
        name: "restaurant_1800_iceberg"
    },
    {
        path: restaurant_1800_lafriteennord,
        name: "restaurant_1800_lafriteennord"
    },
    {
        path: restaurant_1800_lagrangeberger,
        name: "restaurant_1800_lagrangeberger"
    },
    {
        path: restaurant_1800_lapateapizz,
        name: "restaurant_1800_lapateapizz"
    },        
    {
        path: restaurant_1800_lelaurus,
        name: "restaurant_1800_lelaurus"
    },
    {
        path: restaurant_1800_lepetitzinc_belambra,
        name: "restaurant_1800_lepetitzinc_belambra"
    },
    {
        path: restaurant_1800_leptipanier,
        name: "restaurant_1800_leptipanier"
    },
    {
        path: restaurant_1800_lerefugedujambon,
        name: "restaurant_1800_lerefugedujambon"
    },
    {
        path: restaurant_1800_lesconvives,
        name: "restaurant_1800_lesconvives"
    },
    {
        path: restaurant_1800_letrapoun,
        name: "restaurant_1800_letrapoun"
    },
    {
        path: restaurant_1800_mamiecrepe,
        name: "restaurant_1800_mamiecrepe"
    },
    {
        path: restaurant_1800_mountaincafe,
        name: "restaurant_1800_mountaincafe"
    },
    {
        path: restaurant_1800_pizzattitude,
        name: "restaurant_1800_pizzattitude"
    },
    {
        path: restaurant_1800_qualitypizza,
        name: "restaurant_1800_qualitypizza"
    },
    {
        path: restaurant_1800_ramenetabraise,
        name: "restaurant_1800_ramenetabraise"
    },
    {
        path: restaurant_1800_sherpa,
        name: "restaurant_1800_sherpa"
    },
    {
        path: restaurant_1800_spar,
        name: "restaurant_1800_spar"
    },
    {
        path: restaurant_1950_brasserie1950,
        name: "restaurant_1950_brasserie1950"
    },
    {
        path: restaurant_1950_hemingways,
        name: "restaurant_1950_hemingways"
    },
    {
        path: restaurant_1950_latabledeslys,
        name: "restaurant_1950_latabledeslys"
    },
    {
        path: restaurant_1950_lavacherouge,
        name: "restaurant_1950_lavacherouge"
    },
    {
        path: restaurant_1950_lemazot,
        name: "restaurant_1950_lemazot"
    },
    {
        path: restaurant_1950_leperceneige,
        name: "restaurant_1950_leperceneige"
    },
    {
        path: restaurant_1950_lesbellespintes,
        name: "restaurant_1950_lesbellespintes"
    },
    {
        path: restaurant_1950_melissnack,
        name: "restaurant_1950_melissnack"
    }, 
    {
        path: restaurant_1950_nonnalisa,
        name: "restaurant_1950_nonnalisa"
    },
    {
        path: restaurant_2000_auschuss,
        name: "restaurant_2000_auschuss"
    },
    {
        path: restaurant_2000_lekilimandjaro,
        name: "restaurant_2000_lekilimandjaro"
    },
    {
        path: restaurant_2000_leredrock,
        name: "restaurant_2000_leredrock"
    },
    {
        path: restaurant_2000_lesavoy,
        name: "restaurant_2000_lesavoy"
    },
    {
        path: restaurant_2000_papapizza,
        name: "restaurant_2000_papapizza"
    },
]

// Paths validation
// If the path includes "static/media", it's already a good start
restaurantPaths = restaurantPaths.filter(e => e.path.includes("static/media"))
*/

const restaurantsArc1600 = restaurantsData
      ? restaurantsData
      .filter( e => e.resort == "arc1600")[0]
      .restaurants
      .filter( e => e.enabled)
      : {};
const restaurantsArc1800 = restaurantsData
    ? restaurantsData
    .filter( e => e.resort == "arc1800")[0]
    .restaurants
    .filter( e => e.enabled)
    : {};
// const restaurantsArc1950 = restaurantsData
//   ? restaurantsData
//   .filter( e => e.resort == "arc1950")[0]
//   .restaurants
//   .filter( e => e.enabled)
//   : {};
// const restaurantsArc2000 = restaurantsData
//   ? restaurantsData
//   .filter( e => e.resort == "arc2000")[0]
//   .restaurants
//   .filter( e => e.enabled)
//   : {};

const restaurantsFiltered = [
    ...restaurantsArc1600,
    ...restaurantsArc1800,
    // ...restaurantsArc1950,
    // ...restaurantsArc2000,      
  ];

// console.log(restaurantPaths.filter(el => el.name === "restaurant_1800_mamiecrepe")[0].path)

// const restaurantsFiltered = [
//   {
//     name: "La Bûche",
//     imageName: "restaurant_1600_labuche"
//   }
// ]


// DEV DEBUG
// console.log("restaurantsData", restaurantsData)
// console.log("restaurantsFiltered", restaurantsFiltered)
// console.log("restaurantPaths", restaurantPaths)
// console.log(restaurantPaths.filter(el => el.name === "restaurant_1800_mamiecrepe")[0].path)

export {
    // restaurantPaths,
    restaurantNameToPath,
    restaurantsFiltered
}
