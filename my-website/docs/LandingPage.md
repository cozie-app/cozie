---
id: home
title: Introduction
sidebar_label: Introduction
---

# Project Cozie - A smartwatch methodology for quick and easy experience surveys 

## What is Cozie?

[Cozie](https://cozie.app/) is a Fitit Ionic, Versa, Versa Lite and Versa 2 clock face that can ask people questions. It is useful for [experience sampling research](https://en.wikipedia.org/wiki/Experience_sampling_method) and was designed for the built environment, although there are also forks focused on [Covid-19 symptoms tracking](https://github.com/pjayathissa/cozie-covid)

The foundation for this project is the [BUDS Lab](https://www.budslab.org/) efforts towards human sujective feedback in the built environment:

- [Is your clock-face cozie? A smartwatch methodology for the in-situ collection of occupant comfort data](https://www.researchgate.net/publication/337376844_Is_your_clock-face_cozie_A_smartwatch_methodology_for_the_in-situ_collection_of_occupant_comfort_data)
- [Indoor Comfort Personalities: Scalable Occupant Preference Capture Using Micro Ecological Momentary Assessments](https://www.researchgate.net/publication/338527635_Indoor_Comfort_Personalities_Scalable_Occupant_Preference_Capture_Using_Micro_Ecological_Momentary_Assessments)

This documentation guides you on how to:
- Getting Started using the Cozie *Basic* application as hosted by the BUDS Lab. In this scenario, you just want to test out the Cozie app on your own Fitbit immediately. The data will flow into our InfluxDB database and you can extract the data using our REST API. The following documentation pages focus on this use type.
- [Creating your own App](Installation.md) is a process in which you want to fork the Cozie respository and build your own verion with custom questions, etc. You can also use this knowledge to contribute to the core repository.
- Advanced data connectivity discusses the collection of the data from your own app and tips on how to manage and store those data

## License

The Cozie clockface is open sourced under at GPLv3 License.


