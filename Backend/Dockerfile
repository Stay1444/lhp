FROM mcr.microsoft.com/dotnet/sdk:7.0 AS builder

COPY . /tmp/lhp

WORKDIR /tmp/lhp

RUN dotnet restore

WORKDIR /tmp/lhp/Backend

RUN dotnet build --configuration Release

FROM mcr.microsoft.com/dotnet/sdk:7.0

RUN mkdir -p /bin/lhp

COPY --from=builder /tmp/lhp/Backend/bin/Release/net7.0/ /bin/lhp/

RUN chmod +x /bin/lhp/Backend
RUN mkdir -p /var/lib/lhp/
WORKDIR /var/lib/lhp/

ENTRYPOINT [ "/bin/lhp/Backend" ]

