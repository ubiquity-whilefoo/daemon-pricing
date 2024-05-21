# `@ubiquibot/assistive-pricing`

Helps settings prices and adds label to the issues accordingly.

## Usage

```yml
 - plugin: ubiquibot/assistive-pricing@main
   type: github
   with:
     labels:
       time:
         - "Time: <1 Hour"
         - "Time: <2 Hours"
         - "Time: <4 Hours"
         - "Time: <1 Day"
         - "Time: <1 Week"
       priority:
         - "Priority: 1 (Normal)"
         - "Priority: 2 (Medium)"
         - "Priority: 3 (High)"
         - "Priority: 4 (Urgent)"
         - "Priority: 5 (Emergency)"
     basePriceMultiplier: 1
     publicAccessControl:
       setLabel: true
       fundExternalClosedIssue: false
```

## Testing

### Jest
To start Jest tests, run
```shell
yarn test
```
