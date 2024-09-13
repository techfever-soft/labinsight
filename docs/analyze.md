![](https://firebasestorage.googleapis.com/v0/b/lab-insight.appspot.com/o/Frame%203.png?alt=media&token=a104bd9c-f7bd-45ee-83d0-5049b0d3cf4d)

## Analyzing codebase

To perform an analysis, you can run the following command :

```bash
labinsight analyze
```

This will check your entire codebase with a single command. The results will be shown directly in your terminal for now. In-file reports are planned.


### Choosing type directly

You can optionnaly choose an analysis type directly from the CLI to automate the process. You can choose between : "full", "dependencies", "basic", "deep".

```bash
labinsight analyze -t <type>
```

or

```bash
labinsight analyze --type <type>
```

### Keeping reports

You can choose to keep recent reports using this command. Else it will erase and write a new report file.

```bash
labinsight analyze -k
```

or

```bash
labinsight analyze --keep
```
