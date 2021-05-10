function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function go({state, age, vaccine, type, n, mode, searchIntervalInSeconds, appointmentSlot}) {
    if (!state) return
    var script = document.createElement('script');script.src = "https://code.jquery.com/jquery-3.4.1.min.js";document.getElementsByTagName('head')[0].appendChild(script);
    await sleep(500)
    $(".status-switch")[0].click()
    console.log("Selecting State", state)
    await sleep(500)
    $("mat-select")[0].click()
    await sleep(1000)
    $(".mat-option-text").each( (i, e) => { if ($(e).text().trim() === state) $(e).click() })
    await sleep(500)
    var districts = []
    console.log("Waiting for districts to load")
    do {
        $("mat-select")[1].click()
        await sleep(100)
        districts = $(".mat-option-text")
    } while (districts.length === 0)
    console.log(districts.length, " Districts loaded")
    for (i = 0; i < districts.length; i++) {
        $("mat-select")[1].click()
        await sleep(100)
        dEle = $(".mat-option-text")[i]
        dEle.click()
        console.log("Searching district: ", dEle.innerText)
        $(".district-search")[0].click()
        await sleep(100)
        j = 0
        while (j < 10) {
            list = $("mat-selection-list mat-list-option")
            if (list.length > 0) {
                break
            }
            j += 1
            await sleep(500)
        }
        if (age || vaccine || type) {
            $("div.agefilterblock label").each( (i, e) => { if ([age, vaccine, type].indexOf($(e).text().trim()) >= 0) $(e).click() })    
        }
        foundSlot = false
        $("ul.slot-available-wrap").each((row, e) => {
            if (foundSlot) return
            isSlotBooked = true
            $(e).find('li a').each(async (x, slot) => {
                if (parseInt($(slot).text().trim()) || 0 >= n) {
                    isSlotBooked = false
                    if (mode === 1) {
                        $(slot).parents('.slots-box')[0].click()
                        k = 0
                        while (k < 5) {
                            if ($("ion-button.time-slot").length > 0) {
                                break
                            }
                            k += 1
                            await sleep(700)
                        }
                        $("ion-button.time-slot")[appointmentSlot-1].click()
                        $(".captcha-style input")[0].focus()
                        foundSlot = true
                        return
                    }
                }
            })
            if (isSlotBooked) {
                $(e).parents('.mat-list-text')[0].remove()
            }

        })
        if (mode === 1 && foundSlot)
            break
        await sleep(searchIntervalInSeconds*1000)
    }
    
}
