import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useGSAP } from '@gsap/react'

/** Register every GSAP plugin exactly once (plugins silently no-op if unregistered). */
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrollToPlugin)

export { gsap, ScrollTrigger, SplitText, useGSAP }
