Alight, so to get started run this in the project root
```bash
$ docker-compose up
```

This starts creates a new image of the node application and pulls in a copy of
the official mysql docker container. Then it starts everything up and links it
all together via a local network.

On first run, the mysql container will mount the sql-init-dump directory to its
internal `/docker-entrypoint-initdb.d` directory and execute any .sql or .sh
files that it contains. Currently there's a testing .sql file in there that
gives the app something to display, but it'd be easy to put a datadump in this
directory and use it to initialize the mysql instance.

For persistent storage, we'd probably want to mount a data directory on the
server's disk into the mysql container's `/var/lib/mysql directory`.

Note that some changes have been made in order to get Sources to run locally,
and should be changed in a production environment.

See:
https://hub.docker.com/_/mysql/
